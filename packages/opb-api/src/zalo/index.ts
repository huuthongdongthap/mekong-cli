import { Hono } from 'hono';

type Bindings = { DB: D1Database; };
const app = new Hono<{ Bindings: Bindings }>();

function verifySig(body: string, sig: string, secret: string): boolean {
  const { createHmac } = require('crypto');
  return createHmac('sha256', secret).update(body).digest('hex') === sig;
}

app.get('/webhook', (c) => {
  const mode = c.req.query('hub.mode');
  const token = c.req.query('hub.verify_token');
  const challenge = c.req.query('hub.challenge');
  if (mode === 'subscribe' && token === c.env.ZALO_VERIFY_TOKEN) return c.text(challenge || '');
  return c.json({ error: 'Verification failed' }, 403);
});

app.post('/webhook', async (c) => {
  const { DB } = c.env;
  try {
    const event = JSON.parse(await c.req.text());
    if (event.event_name === 'follow') await handleFollow(event, DB);
    else if (event.event_name === 'message') await handleMessage(event, DB);
    else if (event.event_name === 'unfollow') await handleUnfollow(event, DB);
    else if (event.event_name === 'user_submit_csa_text') await handleQuickReply(event, DB);
    return c.json({ status: 'ok' });
  } catch (err) {
    console.error('Zalo webhook error:', err);
    return c.json({ status: 'error' }, 500);
  }
});

async function handleFollow(event: any, DB: D1Database) {
  const zaloId = event.sender?.id; if (!zaloId) return;
  await sendZalo(DB, zaloId, 'Chao ban! 👋\n\nMinh la Mekong OPB — nen tang quan ly doanh nghiep danh rieng cho nguoi Viet lam mot minh.\n\n🎁 Qua tang: 100 cho dung thu MIEN PHI 7 ngay\n\nBan dang kinh doanh linh vuc gi?\n1. Freelancer\n2. Chu shop online\n3. Dich vu\n4. Khac');
  await DB.prepare('INSERT OR IGNORE INTO leads (zalo_id, source, stage, created_at) VALUES (?, ?, ?, datetime("now"))').bind(zaloId, 'zalo_oa', 'aware').run();
}

async function handleMessage(event: any, DB: D1Database) {
  const zaloId = event.sender?.id; if (!zaloId) return;
  const text = (event.message?.text || '').toLowerCase();
  await DB.prepare('INSERT INTO zalo_messages (zalo_id, direction, content, created_at) VALUES (?, "inbound", ?, datetime("now"))').bind(zaloId, event.message?.text || '').run();
  let reply = '';
  if (text.includes('1') || text.includes('freelancer')) reply = 'Tuyet voi! Ban la Freelancer\n\nMekong Freelance giup:\n Tao invoice chuyen nghiep\n Theo doi thoi gian\n Quan ly khach hang\n\nMuon dung thu mien phi?';
  else if (text.includes('2') || text.includes('shop')) reply = 'Chu shop online!\n\nMekong Shop giup:\n Quan ly kho hang\n Theo doi van chuyen\n Bao cao doanh thu\n\nDung thu mien phi 7 ngay?';
  else if (text.includes('3') || text.includes('dich vu')) reply = 'Dich vu!\n\nMekong giup ban quan ly:\n Lich hen khach hang\n Thanh toan online\n Zalo OA tu dong\n\nThu mien phi?';
  else if (text.includes('bắt dau') || text.includes('dung thu')) reply = 'Link dang ky dung thu:\nmekongmind.com/opb';
  else reply = 'Cam on ban quan tam!\n\nTruy cap mekongmind.com/opb de biet them.';
  await sendZalo(DB, zaloId, reply);
}

async function handleUnfollow(event: any, DB: D1Database) {
  const zaloId = event.sender?.id;
  if (zaloId) await DB.prepare("UPDATE leads SET stage = 'churned' WHERE zalo_id = ?").bind(zaloId).run();
}

async function handleQuickReply(event: any, DB: D1Database) {
  const zaloId = event.sender?.id;
  const payload = event.message?.text || '';
  if (payload.startsWith('trial_')) await DB.prepare("UPDATE leads SET stage = 'trial', trial_kit = ? WHERE zalo_id = ?").bind(payload.replace('trial_', ''), zaloId).run();
}

async function sendZalo(DB: D1Database, zaloId: string, content: string) {
  const row = await DB.prepare('SELECT access_token FROM zalo_oauth WHERE id = 1').first();
  if (!row) return;
  await fetch('https://graph.zaloapp.com/v2.0/oa/message', { method: 'POST', headers: { 'Content-Type': 'application/json', access_token: row.access_token as string }, body: JSON.stringify({ recipient: { user_id: zaloId }, message: { text: content } }) });
  await DB.prepare('INSERT INTO zalo_messages (zalo_id, direction, content, created_at) VALUES (?, "outbound", ?, datetime("now"))').bind(zaloId, content).run();
}

export default app;
