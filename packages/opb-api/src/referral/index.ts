import { Hono } from 'hono';
import { authMiddleware } from '../auth';

type Bindings = { DB: D1Database; };
type Env = { DB: D1Database; KV: KVNamespace; };
const app = new Hono<{ Bindings: Env }>();

// POST /referral/generate — create referral code for user
app.post('/generate', async (c, next) => authMiddleware(c, next), async (c) => {
  const user = c.get('user');
  const { DB, KV } = c.env;
  const userId = user.sub;

  // Check existing code
  const existing = await KV.get(`ref:${userId}`);
  if (existing) return c.json({ code: existing, link: `mekongmind.com/opb?ref=${existing}` });

  // Generate unique code: MEK + first 4 chars of user id + random 4
  const code = `MEK${String(userId).slice(0,4)}${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  await KV.put(`ref:${userId}`, code, { expirationTtl: 365 * 24 * 60 * 60 });
  await DB.prepare('UPDATE users SET referral_code = ? WHERE id = ?').bind(code, userId).run();
  return c.json({ code, link: `mekongmind.com/opb?ref=${code}` });
});

// POST /referral/track — track a referral click
app.post('/track', async (c) => {
  const { code } = c.req.valid('json') as any || {};
  if (!code) return c.json({ error: 'Missing code' }, 400);
  const { KV } = c.env;
  const count = await KV.get(`ref:clicks:${code}`);
  await KV.put(`ref:clicks:${code}`, String(parseInt(count || '0') + 1), { expirationTtl: 90 * 24 * 60 * 60 });
  return c.json({ success: true });
});

// GET /referral/stats — user's referral stats
app.get('/stats', async (c, next) => authMiddleware(c, next), async (c) => {
  const user = c.get('user');
  const { DB, KV } = c.env;

  const userRow = await DB.prepare('SELECT referral_code, credits FROM users WHERE id = ?').bind(user.sub).first() as any;
  const code = userRow?.referral_code;
  if (!code) return c.json({ code: null, clicks: 0, conversions: 0, credits_earned: 0 });

  const clicks = parseInt(await KV.get(`ref:clicks:${code}`) || '0');
  const conversions = await DB.prepare('SELECT COUNT(*) as cnt FROM users WHERE referred_by = ?').bind(user.sub).first() as any;
  const creditsEarned = (conversions?.cnt || 0) * 10;

  return c.json({ code, link: `mekongmind.com/opb?ref=${code}`, clicks, conversions: conversions?.cnt || 0, credits_earned: creditsEarned });
});

// POST /referral/convert — record a successful referral conversion
app.post('/convert', async (c) => {
  const { referee_zalo_id, referrer_id } = c.req.valid('json') as any;
  const { DB } = c.env;
  await DB.prepare('UPDATE users SET referred_by = ? WHERE zalo_id = ?').bind(referrer_id, referee_zalo_id).run();
  await DB.prepare('UPDATE users SET credits = credits + 10 WHERE id = ?').bind(referrer_id).run();
  return c.json({ success: true });
});

export default app;
