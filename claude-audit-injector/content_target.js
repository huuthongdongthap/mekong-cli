// Chạy ở tab đích (claude.ai/code hoặc tab chat khác)
// Nhiệm vụ: nhận prompt từ background, inject, chờ response xong, báo lại

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === "injectPrompt") {
    injectAndWait(req.prompt).then(() => {
      sendResponse({ done: true });
    });
    return true; // giữ kênh async
  }
});

async function injectAndWait(text) {
  // 1. Tìm input box
  const editor = await waitFor(() =>
    document.querySelector('div[contenteditable="true"]')
  );
  if (!editor) return console.error("[Audit Target] Không tìm thấy input");

  // 2. Inject text
  editor.focus();
  // Dùng execCommand để tương thích React
  document.execCommand("selectAll");
  document.execCommand("insertText", false, text);

  // Fallback nếu execCommand không hoạt động
  if (!editor.innerText.trim()) {
    editor.innerText = text;
    editor.dispatchEvent(new InputEvent("input", { bubbles: true }));
  }

  console.log("[Audit Target] Đã inject:", text.substring(0, 60) + "...");

  // 3. Click Send
  await sleep(400);
  const sendBtn = await waitFor(() => {
    const btn = document.querySelector('button[aria-label="Send message"]');
    return btn && !btn.disabled ? btn : null;
  });
  if (sendBtn) sendBtn.click();

  // 4. Chờ streaming bắt đầu rồi kết thúc
  await sleep(800);
  await waitFor(() => document.querySelector('[data-is-streaming="true"]'), 5000);
  await waitFor(() => !document.querySelector('[data-is-streaming="true"]'), 120000);

  console.log("[Audit Target] Response xong, sẵn sàng cho prompt tiếp theo");
}

// Helper: poll đến khi condition đúng
function waitFor(fn, timeout = 15000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const id = setInterval(() => {
      const val = fn();
      if (val) { clearInterval(id); resolve(val); }
      if (Date.now() - start > timeout) { clearInterval(id); resolve(null); }
    }, 300);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

console.log("[Audit Target] Sẵn sàng nhận prompts...");