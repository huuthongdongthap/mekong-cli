import { Hono } from 'hono';
import { authMiddleware } from '../auth';

type Bindings = { DB: D1Database; KV: KVNamespace; };
type Env = { DB: D1Database; KV: KVNamespace; };
const app = new Hono<{ Bindings: Env }>();

const NURTURE_TEMPLATES: Record<string, Record<string, string>> = {
  day0_freelance: `🎉 Chào mừng bạn đến Mekong Freelance!

Mình đã mở khóa cho bạn:
✅ Tạo invoice chuyên nghiệp (TT78)
✅ Quản lý khách hàng
✅ 50 credits miễn phí

Bắt đầu ngay:
1. Vào dashboard → Tạo invoice đầu tiên
2. Gửi cho khách hàng → nhận tiền nhanh hơn

Cần hỗ trợ? Reply "help" nhé!`,
  day0_shop: `🎉 Chào mừng bạn đến Mekong Shop!

Tính năng đã mở khóa:
✅ Quản lý kho hàng
✅ Theo dõi vận chuyển
✅ 50 credits miễn phí

Bắt đầu:
1. Thêm sản phẩm đầu tiên
2. Tạo đơn hàng test
3. Xem báo cáo doanh thu

Reply "help" nếu cần hỗ trợ!`,
  day3_checkin: `Xin chào! 👋

Đã 3 ngày bạn dùng Mekong rồi — mình muốn hỏi:

Bạn đã thử tính năng nào chưa?
1. Tạo invoice / đơn hàng
2. Quản lý khách hàng
3. Tính năng khác

Feedback của bạn giúp mình cải thiện sản phẩm nhiều lắm! 🙏`,
  day7_feature: `💡 Tip tuần này: Tự động hóa Zalo OA

Bạn biết không? Có thể tự động:
📩 Gửi reminder đơn hàng cho khách
📊 Báo cáo doanh thu hàng tuần
💳 Nhắc thanh toán tự động

Muốn thử? Reply "yes" để mình hướng dẫn!`,
  day14_nps: `Mình cần sự giúp đỡ của bạn! 🙏

Đã 2 tuần bạn dùng Mekong — bạn có thể đánh giá từ 1-10:
"Bạn có giới thiệu Mekong cho bạn bè không?"

1-6: Mình cần cải thiện gì?
7-8: Cảm ơn! Có gì mình làm tốt hơn?
9-10: 🎁 Bạn được 1 tháng MIỄN PHÍ!`,
  day21_upsell: `🎁 Ưu đãi đặc biệt cho bạn!

Chỉ còn 3 ngày nữa thử nghiệm miễn phí kết thúc.

Nâng cấp ngay:
→ Giảm 50% tháng đầu (199K → 99K)
→ Mở khóa tất cả tính năng
→ Hỗ trợ ưu tiên

Reply "upgrade" để nhận link thanh toán!`,
  churn_warning: `Mình thấy bạn chưa hoạt động 7 ngày 😢

Có điều gì không ổn không?
1. Khó dùng → mình hướng dẫn
2. Không cần nữa → mình giảm giá
3. Khác → cho mình biết nhé

Reply để mình giúp bạn!`,
  winback: `Nhớ bạn không? 😊

Mình có quà cho bạn comeback:
🎁 14 ngày dùng thử MIỄN PHÍ (gấp đôi bình thường)

Reply "comeback" để nhận!`,
};

// POST /nurture/send — send nurture message
app.post('/send', async (c, next) => authMiddleware(c, next), async (c) => {
  const { template_key, recipient_zalo_id } = c.req.valid('json') as any;
  const message = NURTURE_TEMPLATES[template_key];
  if (!message) return c.json({ error: 'Unknown template' }, 400);
  return sendZaloMessage(c.env, recipient_zalo_id, message);
});

// GET /nurture/templates — list all templates
app.get('/templates', (c) => c.json({ templates: Object.keys(NURTURE_TEMPLATES) }));

async function sendZaloMessage(env: Env, zaloId: string, content: string) {
  const row = await env.DB.prepare('SELECT access_token FROM zalo_oauth WHERE id = 1').first();
  if (!row) return;
  await fetch('https://graph.zaloapp.com/v2.0/oa/message', { method: 'POST', headers: { 'Content-Type': 'application/json', access_token: row.access_token as string }, body: JSON.stringify({ recipient: { user_id: zaloId }, message: { text: content } }) });
  await env.DB.prepare('INSERT INTO zalo_messages (zalo_id, direction, content, created_at) VALUES (?, "outbound", ?, datetime("now"))').bind(zaloId, content).run();
}

export default app;
