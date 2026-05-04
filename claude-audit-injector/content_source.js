// Chạy ở tab anh đang chat với em
// Nhiệm vụ: phát hiện khi em xuất prompts, parse ra, gửi lên background

let lastProcessed = "";

// Em sẽ xuất prompts theo format chuẩn này trong response:
// ```prompts
// 1. [nội dung prompt 1]
// 2. [nội dung prompt 2]
// ```
function parsePrompts(text) {
  const match = text.match(/```prompts\n([\s\S]*?)```/);
  if (!match) return [];
  return match[1]
    .split("\n")
    .map(l => l.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
}

// Quan sát DOM để phát hiện response mới hoàn thành
const observer = new MutationObserver(() => {
  // Lấy response cuối cùng của Claude (không còn spinner = đã xong)
  const isStreaming = document.querySelector('[data-is-streaming="true"]');
  if (isStreaming) return; // đang stream, chờ

  const messages = document.querySelectorAll('[data-testid="assistant-message"]');
  if (!messages.length) return;

  const last = messages[messages.length - 1];
  const text = last.innerText;

  if (text === lastProcessed) return; // đã xử lý rồi
  lastProcessed = text;

  const prompts = parsePrompts(text);
  if (!prompts.length) return;

  console.log("[Audit Source] Tìm thấy", prompts.length, "prompts");

  chrome.runtime.sendMessage({
    action: "queuePrompts",
    prompts
  });
});

observer.observe(document.body, { childList: true, subtree: true });
console.log("[Audit Source] Đang lắng nghe response từ Claude...");