/**
 * Pilot Recruitment API
 *
 * Endpoints:
 *   POST /pilot/signup      — capture lead from landing page
 *   GET  /pilot/stats       — recruitment dashboard stats
 *   GET  /pilot/leads       — all pilot leads
 *   PATCH /pilot/leads/:id  — update lead stage
 *   POST /pilot/broadcast   — send broadcast to Zalo OA
 *   POST /pilot/checkin     — trigger nurture for user
 *   GET  /pilot/health      — recruitment health check
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

type Bindings = {
  DB: D1Database;
  KV: KVNamespace;
  ZALO_APP_ID: string;
  ZALO_APP_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// ─── Schemas ────────────────────────────────────────────────────────

const signupSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^(\+84|0)[3-9][0-9]{8}$/).optional().or(z.literal('')),
  zalo_id: z.string().optional(),
  business_type: z.enum(['freelancer', 'shop_online', 'services', 'other']),
  pain_point: z.string().optional(),
  source: z.enum(['landing_page', 'zalo_oa', 'tiktok', 'referral', 'fb_group']).default('landing_page'),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

const updateStageSchema = z.object({
  stage: z.enum(['aware', 'interested', 'trial', 'active', 'paid', 'churned']),
});

const broadcastSchema = z.object({
  message: z.string().min(1).max(1000),
  target: z.enum(['all', 'trial', 'active', 'paid']).default('all'),
});

// ─── Helpers ────────────────────────────────────────────────────────

async function sendZaloMessage(env: Bindings, zaloId: string, content: string) {
  // In production: use Zalo OA access token from env or DB
  const appId = env.ZALO_APP_ID;
  const appSecret = env.ZALO_APP_SECRET;

  if (!appId || !appSecret) {
    console.warn('[pilot] Zalo credentials not configured, skipping send');
    return { sent: false, reason: 'no_credentials' };
  }

  // Get access token
  const tokenRes = await fetch('https://oauth.zaloapp.com/v4/oa/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      app_id: appId,
      app_secret: appSecret,
    }),
  });

  if (!tokenRes.ok) {
    console.error('[pilot] Failed to get Zalo token');
    return { sent: false, reason: 'token_failed' };
  }

  const tokenData = await tokenRes.json<{ access_token: string }>();

  const sendRes = await fetch('https://graph.zaloapp.com/v2.0/oa/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      access_token: tokenData.access_token,
    },
    body: JSON.stringify({
      recipient: { user_id: zaloId },
      message: { text: content },
    }),
  });

  if (!sendRes.ok) {
    console.error('[pilot] Zalo send failed:', await sendRes.text());
    return { sent: false, reason: 'send_failed' };
  }

  return { sent: true };
}

// ─── Routes ─────────────────────────────────────────────────────────

// POST /pilot/signup — Capture lead from landing page
app.post('/signup', zValidator('json', signupSchema), async (c) => {
  const data = c.req.valid('json');
  const { DB, KV } = c.env;

  try {
    // Check if phone already registered
    const existing = data.phone
      ? await DB.prepare('SELECT id, stage FROM leads WHERE phone = ?').bind(data.phone).first()
      : null;

    if (existing) {
      return c.json({ success: true, message: 'Đã có trong hệ thống', lead_id: existing.id, is_returning: true });
    }

    // Create lead
    const result = await DB.prepare(
      `INSERT INTO leads (zalo_id, name, source, pain_point, business_type, stage, created_at)
       VALUES (?, ?, ?, ?, ?, 'aware', datetime('now'))`
    ).bind(data.zalo_id || null, data.name, data.source, data.pain_point || null, data.business_type).run();

    const leadId = result.meta.last_row_id;

    // Track UTM in KV (7-day TTL)
    if (data.utm_source || data.utm_campaign) {
      await KV.put(
        `pilot:utm:${leadId}`,
        JSON.stringify({
          source: data.utm_source,
          medium: data.utm_medium,
          campaign: data.utm_campaign,
          signed_up_at: new Date().toISOString(),
        }),
        { expirationTtl: 60 * 60 * 24 * 365 }
      );
    }

    // Track signup event
    await DB.prepare(
      `INSERT INTO usage_events (user_id, command, credits_deducted, metadata, created_at)
       VALUES (0, 'pilot.signup', 0, ?, datetime('now'))`
    ).bind(JSON.stringify({ lead_id: leadId, source: data.source, business_type: data.business_type })).run();

    return c.json({
      success: true,
      lead_id: leadId,
      message: 'Đăng ký thành công! Kiểm tra Zalo để nhận quà tặng.',
      next_step: data.zalo_id ? 'nurture_day0' : 'link_zalo',
    });
  } catch (err) {
    console.error('[pilot/signup]', err);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// GET /pilot/stats — Recruitment dashboard
app.get('/stats', async (c) => {
  const { DB } = c.env;

  try {
    // Total leads
    const totalResult = await DB.prepare('SELECT COUNT(*) as total FROM leads').first<{ total: number }>();

    // By stage
    const stageResult = await DB.prepare(
      'SELECT stage, COUNT(*) as count FROM leads GROUP BY stage ORDER BY count DESC'
    ).all();

    // By source
    const sourceResult = await DB.prepare(
      'SELECT source, COUNT(*) as count FROM leads GROUP BY source ORDER BY count DESC'
    ).all();

    // By business type
    const bizResult = await DB.prepare(
      'SELECT business_type, COUNT(*) as count FROM leads WHERE business_type IS NOT NULL GROUP BY business_type'
    ).all();

    // Conversion rate (trial → paid)
    const trialResult = await DB.prepare(
      "SELECT COUNT(*) as total FROM leads WHERE stage IN ('trial', 'active', 'paid')"
    ).first<{ total: number }>();
    const paidResult = await DB.prepare("SELECT COUNT(*) as total FROM leads WHERE stage = 'paid'").first<{ total: number }>();

    // Signup velocity (last 7 days)
    const velocityResult = await DB.prepare(
      "SELECT DATE(created_at) as date, COUNT(*) as count FROM leads WHERE created_at >= datetime('now', '-7 days') GROUP BY DATE(created_at) ORDER BY date"
    ).all();

    // Registered users
    const usersResult = await DB.prepare('SELECT COUNT(*) as total FROM users').first<{ total: number }>();

    return c.json({
      total_leads: totalResult?.total ?? 0,
      registered_users: usersResult?.total ?? 0,
      by_stage: stageResult.results,
      by_source: sourceResult.results,
      by_business_type: bizResult.results,
      conversion_rate: {
        trial_plus: trialResult?.total ?? 0,
        paid: paidResult?.total ?? 0,
        rate: (paidResult?.total ?? 0) > 0
          ? Math.round((paidResult.total / trialResult.total) * 100)
          : 0,
      },
      velocity: velocityResult.results,
      goal: 100,
      progress: Math.round(((totalResult?.total ?? 0) / 100) * 100),
    });
  } catch (err) {
    console.error('[pilot/stats]', err);
    return c.json({ error: 'Stats failed' }, 500);
  }
});

// GET /pilot/leads — All leads with optional filters
app.get('/leads', async (c) => {
  const { DB } = c.env;
  const stage = c.req.query('stage');
  const source = c.req.query('source');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    let query = 'SELECT * FROM leads';
    const params: string[] = [];
    const conditions: string[] = [];

    if (stage) { conditions.push('stage = ?'); params.push(stage); }
    if (source) { conditions.push('source = ?'); params.push(source); }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const result = await DB.prepare(query).bind(...params, limit, offset).all();

    return c.json({ leads: result.results, total: result.results.length });
  } catch (err) {
    console.error('[pilot/leads]', err);
    return c.json({ error: 'Failed' }, 500);
  }
});

// PATCH /pilot/leads/:id — Update lead stage
app.patch('/leads/:id', zValidator('json', updateStageSchema), async (c) => {
  const id = c.req.param('id');
  const { stage } = c.req.valid('json');
  const { DB } = c.env;

  try {
    const convertedAt = (stage === 'paid' || stage === 'active') ? 'datetime("now")' : 'NULL';

    await DB.prepare(
      `UPDATE leads SET stage = ?, converted_at = ${convertedAt} WHERE id = ?`
    ).bind(stage, id).run();

    return c.json({ success: true, stage });
  } catch (err) {
    console.error('[pilot/leads/:id]', err);
    return c.json({ error: 'Update failed' }, 500);
  }
});

// POST /pilot/broadcast — Send broadcast to Zalo OA followers
app.post('/broadcast', zValidator('json', broadcastSchema), async (c) => {
  const { message, target } = c.req.valid('json');
  const { DB, KV } = c.env;

  try {
    // Get recipients based on target
    let recipients: any[] = [];
    switch (target) {
      case 'trial':
        recipients = await DB.prepare("SELECT zalo_id FROM leads WHERE stage IN ('aware', 'interested', 'trial') AND zalo_id IS NOT NULL").all().then(r => r.results);
        break;
      case 'active':
        recipients = await DB.prepare("SELECT zalo_id FROM leads WHERE stage IN ('trial', 'active') AND zalo_id IS NOT NULL").all().then(r => r.results);
        break;
      case 'paid':
        recipients = await DB.prepare("SELECT zalo_id FROM leads WHERE stage = 'paid' AND zalo_id IS NOT NULL").all().then(r => r.results);
        break;
      default:
        recipients = await DB.prepare('SELECT zalo_id FROM leads WHERE zalo_id IS NOT NULL').all().then(r => r.results);
    }

    // Store broadcast in KV for rate limiting
    const broadcastId = `broadcast:${Date.now()}`;
    await KV.put(broadcastId, JSON.stringify({
      message,
      target,
      recipient_count: recipients.length,
      sent_at: new Date().toISOString(),
      status: 'queued',
    }), { expirationTtl: 60 * 60 * 24 * 30 });

    // Log broadcast
    await DB.prepare(
      'INSERT INTO usage_events (user_id, command, credits_deducted, metadata, created_at) VALUES (0, ?, 0, ?, datetime("now"))'
    ).bind('pilot.broadcast', JSON.stringify({
      broadcast_id: broadcastId,
      target,
      recipient_count: recipients.length,
      message_preview: message.substring(0, 100),
    })).run();

    // In production: trigger actual Zalo OA broadcast API
    // For now, return queued status with recipient count
    return c.json({
      success: true,
      broadcast_id: broadcastId,
      status: 'queued',
      recipient_count: recipients.length,
      target,
      message: 'Broadcast queued. Connect Zalo OA credentials to enable actual sending.',
    });
  } catch (err) {
    console.error('[pilot/broadcast]', err);
    return c.json({ error: 'Broadcast failed' }, 500);
  }
});

// POST /pilot/checkin — Trigger nurture sequence for user
app.post('/checkin', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { user_id, day } = body;
  const { DB } = c.env;

  try {
    // Get user info
    const user = await DB.prepare('SELECT id, name, phone, tier, zalo_id, created_at FROM users WHERE id = ?').bind(user_id).first();

    if (!user) return c.json({ error: 'User not found' }, 404);

    // Calculate days since signup
    const created = new Date(user.created_at as string);
    const daysSince = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));

    // Select nurture template
    const templates: Record<number, { key: string; label: string }> = {
      0: { key: 'day0_freelance', label: 'Welcome + kit unlock' },
      3: { key: 'day3_checkin', label: '3-day checkin' },
      7: { key: 'day7_feature', label: 'Feature tip' },
      14: { key: 'day14_nps', label: 'NPS survey' },
      21: { key: 'day21_upsell', label: 'Upgrade offer' },
    };

    const template = templates[daysSince] || templates[Math.min(daysSince, 21)];

    // Get Zalo message for this template
    const nurtureResult = await DB.prepare(
      "SELECT content FROM zalo_messages WHERE direction = 'outbound' AND content LIKE ? ORDER BY id DESC LIMIT 1"
    ).bind(`%${template.label}%`).first();

    const message = nurtureResult
      ? (nurtureResult as any).content
      : `Xin chào ${user.name}! 👋\n\nMình là Mekong OPB — đã ${daysSince} ngày bạn tham gia rồi!\n\nCó gì mình hỗ trợ không? Reply "help" nhé!`;

    // Send via Zalo if we have zalo_id
    let sent = false;
    if (user.zalo_id) {
      const result = await sendZaloMessage(c.env, user.zalo_id as string, message);
      sent = result.sent;
    }

    // Log checkin
    await DB.prepare(
      'INSERT INTO usage_events (user_id, command, credits_deducted, metadata, created_at) VALUES (?, ?, 0, ?, datetime("now"))'
    ).bind(user_id, 'pilot.checkin', JSON.stringify({ day: daysSince, template: template.key, sent })).run();

    return c.json({
      success: true,
      user_id,
      user_name: user.name,
      day: daysSince,
      template: template.key,
      sent,
      message_preview: message.substring(0, 100),
    });
  } catch (err) {
    console.error('[pilot/checkin]', err);
    return c.json({ error: 'Checkin failed' }, 500);
  }
});

// GET /pilot/health — Recruitment health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'pilot-recruitment',
    timestamp: new Date().toISOString(),
    goal: 100,
    api_endpoint: 'https://mekong-opb-api.sadec-marketing-hub.workers.dev/pilot',
  });
});

export default app;
