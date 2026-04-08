# Zalo Auto Sales — Claude Code CLI Delegation

Bạn (Claude Code CLI) được giao nhiệm vụ hoàn thiện toàn bộ hệ thống Zalo Auto Sales backend dựa trên cấu trúc đã được dựng sẵn. Dưới đây là mục tiêu, định hướng kiến trúc và các task cụ thể.

## 1. Bối cảnh & Hiện trạng

Dự án nằm tại: `zalo-auto-sales/`

Các file cốt lõi Hono + Cloudflare Worker D1 đã được khởi tạo xong:
1. `wrangler.toml` — Cấu hình cron, bindings
2. `src/db/schema.sql` — Schema khá chi tiết (sequences, steps, enrollments, contacts, logs, tokens).
3. `src/types.ts` — Type definitions chuẩn cho Zalo API và DB.
4. `src/lib/zalo-api.ts` — Zalo API Wrapper (Oauth2 server-to-server thuần, không có browser/session cookie).
5. `src/lib/human-sender.ts` — Giả lập hành vi bắn tin người thật (delay ngẫu nhiên, giờ thức VN, jitter timezone).
6. `src/lib/sequence-engine.ts` — Engine Core xử lý tự động gửi tin 48h vs template tính phí.
7. `src/lib/token-manager.ts` — Engine xử lý tự refresh oauth token.

## 2. Nhiệm vụ của Claude Code CLI (Phase 2 & Phase 3)

Bạn cần hoàn thiện Phase 2 và Phase 3 theo checklist dưới đây:

### Task 1: Dàn Hono Router chính (`src/index.ts`)
- Khởi tạo app Hono với type `Env`.
- Bind `D1Database` middleware để pass cho context.
- Setup cron trigger entrypoint (sử dụng API mặc định của worker `scheduled(event, env, ctx)` bên ngoài Hono hoặc bọc lại cho đúng pattern của Hono Fire). Cron sẽ gọi `SequenceEngine.processDueMessages()`.
- Export default module fetch/scheduled đúng chuẩn Cloudflare Workers.

### Task 2: Các Endpoints cho Admin API (`src/routes/api.ts`)
Viết router `/api/*`:
- CRUD Sequences: List, Create, Get, Update, Delete và active/deactive toggle.
- Create Sequence Steps: endpoint để add steps vào 1 sequence.
- CRUD Contacts: Lấy danh sách contact, user ID, số đt (nếu có user_submit_info).
- CRUD Enrollments: Assign contact thủ công vào sequence.
- GET `/api/status`: Check trạng thái token OAuth, thông tin account OA hiện tại.

*Authentication lưu ý: Do đây là local/hono worker app, hãy mock một middleware BasicAuth hoặc Bearer token cho `/api/*` để test local an toàn hơn nếu cần.*

### Task 3: Webhook handler (`src/routes/webhook.ts`)
Tạo endpoint POST `/webhook`:
- Extract Zalo OA Headers và payload.
- Extract `X-ZEvent-Signature` và sử dụng hàm `verifyWebhookSignature` (zalo-api.ts) để validate tính xác thực. Ném 401 nếu lỗi.
- Handler riêng cho event `event_name === 'follow'`: Lưu user vào DB -> trigger `engine.autoEnrollByEvent('follow')'.
- Handler cho event `event_name === 'unfollow'`: Xoá hoặc đánh dấu is_following = 0, status của các enrollments = 'cancelled'.
- Handler cho event `event_name === 'user_send_text'`: 
  - Cập nhật `last_interaction_at = now()`.
  - Check keyword gửi tin -> trigger `engine.autoEnrollByEvent('keyword', messageText)`.
- Trả về `{"error":0,"message":"Success"}` trong 2 giây (yêu cầu bắt buộc của Zalo API) bằng cách offload việc DB vào `ctx.executionCtx.waitUntil()`.

### Task 4: Setup UI Cơ Bản (`public/index.html` hoặc serve static GET `/`)
- Render một HTML page có CDN Alpine.js + Tailwind CSS.
- Chứa giao diện test thử: Lấy trạng thái token, Liệt kê Sequence có trong DB và danh sách contact. 
*(UI chỉ cần basic test-flow, không cần phức tạp, dùng CDN Hono Serve Static hoặc raw string output tùy độ phức tạp)*

## 3. Chú ý quan trọng

1. Tất cả code base là TypeScript, `es2022`, module `bundler`.
2. Truy xuất Database qua Cloudflare D1 (đã define trong type `Env`).
3. Dùng Hono `^4.7.0`.
4. Không dùng lệnh cài thêm package NPM nào trừ Hono đã có.
5. Khi hoàn thành toàn bộ, bạn phải test compile hoặc suggest lệnh `npx wrangler dev` để chạy.

Bắt đầu thực thi đi Claude Code CLI! Hướng tới việc hoàn thành trong tối đa 5-8 bước tương tác.
