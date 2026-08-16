import { Hono } from 'hono';
import { authMiddleware } from '../auth';

type Bindings = { DB: D1Database; };
type Env = { DB: D1Database; };
const app = new Hono<{ Bindings: Env }>();

// GET /churn/risk — identify users at risk of churning
app.get('/risk', async (c, next) => authMiddleware(c, next), async (c) => {
  const user = c.get('user');
  const { DB } = c.env;

  // Users inactive > 7 days with trial tier
  const atRisk = await DB.prepare(`
    SELECT id, name, tier, credits, updated_at,
    julianday('now') - julianday(updated_at) as days_inactive
    FROM users
    WHERE tier = 'trial'
    AND updated_at < datetime('now', '-7 days')
    LIMIT 20
  `).all();

  return c.json({ at_risk: atRisk.results });
});

// GET /churn/winback — generate win-back campaign targets
app.get('/winback', async (c) => {
  const { DB } = c.env;
  // Users who churned in last 30 days
  const churned = await DB.prepare(`
    SELECT l.zalo_id, l.pain_point, l.business_type, l.created_at
    FROM leads l
    WHERE l.stage = 'churned'
    AND l.created_at > datetime('now', '-30 days')
    LIMIT 50
  `).all();
  return c.json({ winback_targets: churned.results });
});

// POST /churn/prevent — trigger churn prevention for a user
app.post('/prevent', async (c, next) => authMiddleware(c, next), async (c) => {
  const { user_id } = c.req.valid('json') as any || {};
  const { DB, KV } = c.env;

  // Mark as winback campaign sent
  await KV.put(`churn:${user_id}`, 'winback_sent', { expirationTtl: 14 * 24 * 60 * 60 });
  return c.json({ success: true, action: 'winback_campaign_sent' });
});

export default app;
