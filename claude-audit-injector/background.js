// Service worker — não trung tâm
// Giữ queue prompts, gửi từng cái sang tab đích, chờ done rồi mới gửi tiếp

let queue = [];
let isRunning = false;
let targetTabId = null; // tab đích anh chỉ định

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  switch (req.action) {

    case "queuePrompts":
      queue.push(...req.prompts);
      console.log("[BG] Queue hiện tại:", queue.length, "prompts");
      broadcastStatus();
      if (!isRunning) runQueue();
      break;

    case "setTargetTab":
      targetTabId = req.tabId;
      console.log("[BG] Tab đích đã set:", targetTabId);
      sendResponse({ ok: true });
      break;

    case "getStatus":
      sendResponse({ queue: queue.length, isRunning, targetTabId });
      break;

    case "clearQueue":
      queue = [];
      isRunning = false;
      broadcastStatus();
      break;
  }
});

async function runQueue() {
  if (!targetTabId) {
    console.warn("[BG] Chưa set tab đích!");
    return;
  }
  isRunning = true;

  while (queue.length > 0) {
    const prompt = queue.shift();
    console.log("[BG] Bắn prompt:", prompt.substring(0, 60) + "...");
    broadcastStatus();

    try {
      await sendToTarget(prompt);
      console.log("[BG] Prompt xong, nghỉ 1s rồi bắn tiếp...");
      await sleep(1000);
    } catch (e) {
      console.error("[BG] Lỗi:", e);
      queue.unshift(prompt); // đưa lại vào đầu queue
      break;
    }
  }

  isRunning = false;
  broadcastStatus();
  console.log("[BG] Queue hoàn thành!");
}

function sendToTarget(prompt) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      targetTabId,
      { action: "injectPrompt", prompt },
      (res) => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        if (res?.done) resolve();
        else reject(new Error("Target không response"));
      }
    );
  });
}

function broadcastStatus() {
  chrome.runtime.sendMessage({
    action: "statusUpdate",
    queue: queue.length,
    isRunning,
    targetTabId
  }).catch(() => {}); // popup có thể đóng rồi
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}