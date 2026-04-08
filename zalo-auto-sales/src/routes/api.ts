// Admin API Router — CRUD for sequences, contacts, enrollments
// Auth: Bearer token via env ADMIN_TOKEN (skip if not set → dev mode)

import { Hono } from 'hono';
import type { Env, ApiResponse, CreateSequenceRequest, Contact } from '../types';
import { TokenManager } from '../lib/token-manager';
import { SequenceEngine } from '../lib/sequence-engine';
import { TemplateEngine } from '../lib/template-engine';
import { AIService } from '../lib/ai-service';
import { generateId } from '../lib/utils';

export const apiRouter = new Hono<{ Bindings: Env }>();

// ─── Auth Middleware ──────────────────────────────────────────

apiRouter.use('/*', async (c, next) => {
  const adminToken = c.env.ADMIN_TOKEN;
  if (adminToken) {
    const auth = c.req.header('Authorization');
    if (!auth || auth !== `Bearer ${adminToken}`) {
      return c.json<ApiResponse>({ success: false, error: 'Unauthorized' }, 401);
    }
  }
  await next();
});

// ─── OAs ─────────────────────────────────────────────────────

// GET /api/oas — list all connected OAs (mask secrets)
apiRouter.get('/oas', async (c) => {
  const tm = new TokenManager(c.env.DB);
  const oas = await tm.listOAs();
  const masked = oas.map(o => ({
    id: o.id,
    oa_id: o.oa_id,
    app_id: o.app_id,
    display_name: o.display_name,
    access_token_expires_at: o.access_token_expires_at,
    is_expiring_soon: o.access_token_expires_at ? tm.isExpiringSoon(o.access_token_expires_at) : true,
    has_oa_secret_key: !!o.oa_secret_key,
    updated_at: o.updated_at,
  }));
  return c.json<ApiResponse>({ success: true, data: masked, meta: { total: masked.length } });
});

// DELETE /api/oas/:id — disconnect an OA
apiRouter.delete('/oas/:id', async (c) => {
  const id = c.req.param('id');
  const tm = new TokenManager(c.env.DB);
  const existing = await tm.getTokens(id);
  if (!existing) return c.json<ApiResponse>({ success: false, error: 'OA not found' }, 404);
  await tm.deleteOA(id);
  return c.json<ApiResponse>({ success: true, data: { deleted: id } });
});

// ─── Status ──────────────────────────────────────────────────

// GET /api/status — token health + OA info
apiRouter.get('/status', async (c) => {
  const tm = new TokenManager(c.env.DB);
  const tokens = await tm.getTokens();

  if (!tokens) {
    return c.json<ApiResponse>({
      success: true,
      data: { configured: false, message: 'No tokens. Go to /login to setup.' },
    });
  }

  const isExpiring = tm.isExpiringSoon(tokens.access_token_expires_at);
  return c.json<ApiResponse>({
    success: true,
    data: {
      configured: true,
      oa_id: tokens.oa_id,
      app_id: tokens.app_id,
      access_token_expires_at: tokens.access_token_expires_at,
      is_expiring_soon: isExpiring,
      has_oa_secret_key: !!tokens.oa_secret_key,
      updated_at: tokens.updated_at,
    },
  });
});

// ─── Sequences ────────────────────────────────────────────────

// GET /api/sequences
apiRouter.get('/sequences', async (c) => {
  const oaId = c.req.query('oa_id');
  let query = 'SELECT * FROM sequences';
  const params: any[] = [];
  if (oaId) { query += ' WHERE oa_id = ?'; params.push(oaId); }
  query += ' ORDER BY created_at DESC';
  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json<ApiResponse>({ success: true, data: results, meta: { total: results.length } });
});

// POST /api/sequences
apiRouter.post('/sequences', async (c) => {
  const body = await c.req.json<CreateSequenceRequest>();
  if (!body.name) {
    return c.json<ApiResponse>({ success: false, error: 'name is required' }, 400);
  }

  const id = generateId();
  await c.env.DB
    .prepare(`
      INSERT INTO sequences (id, name, description, trigger_event, trigger_keyword, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `)
    .bind(id, body.name, body.description || null, body.trigger_event || 'manual', body.trigger_keyword || null)
    .run();

  // Insert steps if provided
  if (body.steps?.length) {
    for (let i = 0; i < body.steps.length; i++) {
      const s = body.steps[i];
      await c.env.DB
        .prepare(`
          INSERT INTO sequence_steps (id, sequence_id, step_order, delay_minutes,
            message_type, template_id, message_content, media_url, cta_title, cta_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          generateId(), id, i + 1, s.delay_minutes,
          s.message_type || 'text', s.template_id || null, s.message_content,
          s.media_url || null, s.cta_title || null, s.cta_url || null,
        )
        .run();
    }
  }

  const created = await c.env.DB.prepare('SELECT * FROM sequences WHERE id = ?').bind(id).first();
  return c.json<ApiResponse>({ success: true, data: created }, 201);
});

// GET /api/sequences/:id
apiRouter.get('/sequences/:id', async (c) => {
  const seq = await c.env.DB
    .prepare('SELECT * FROM sequences WHERE id = ?')
    .bind(c.req.param('id'))
    .first();
  if (!seq) return c.json<ApiResponse>({ success: false, error: 'Not found' }, 404);

  const { results: steps } = await c.env.DB
    .prepare('SELECT * FROM sequence_steps WHERE sequence_id = ? ORDER BY step_order ASC')
    .bind(c.req.param('id'))
    .all();

  return c.json<ApiResponse>({ success: true, data: { ...seq, steps } });
});

// PUT /api/sequences/:id
apiRouter.put('/sequences/:id', async (c) => {
  const body = await c.req.json<Partial<CreateSequenceRequest>>();
  const id = c.req.param('id');

  await c.env.DB
    .prepare(`
      UPDATE sequences SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        trigger_event = COALESCE(?, trigger_event),
        trigger_keyword = COALESCE(?, trigger_keyword),
        updated_at = datetime('now')
      WHERE id = ?
    `)
    .bind(body.name || null, body.description || null, body.trigger_event || null, body.trigger_keyword || null, id)
    .run();

  const updated = await c.env.DB.prepare('SELECT * FROM sequences WHERE id = ?').bind(id).first();
  if (!updated) return c.json<ApiResponse>({ success: false, error: 'Not found' }, 404);
  return c.json<ApiResponse>({ success: true, data: updated });
});

// DELETE /api/sequences/:id
apiRouter.delete('/sequences/:id', async (c) => {
  const id = c.req.param('id');
  const seq = await c.env.DB.prepare('SELECT id FROM sequences WHERE id = ?').bind(id).first();
  if (!seq) return c.json<ApiResponse>({ success: false, error: 'Not found' }, 404);

  await c.env.DB.prepare('DELETE FROM sequences WHERE id = ?').bind(id).run();
  return c.json<ApiResponse>({ success: true, data: { deleted: id } });
});

// PATCH /api/sequences/:id/toggle — flip is_active
apiRouter.patch('/sequences/:id/toggle', async (c) => {
  const id = c.req.param('id');
  const seq = await c.env.DB
    .prepare('SELECT id, is_active FROM sequences WHERE id = ?')
    .bind(id)
    .first<{ id: string; is_active: number }>();
  if (!seq) return c.json<ApiResponse>({ success: false, error: 'Not found' }, 404);

  const newActive = seq.is_active === 1 ? 0 : 1;
  await c.env.DB
    .prepare("UPDATE sequences SET is_active = ?, updated_at = datetime('now') WHERE id = ?")
    .bind(newActive, id)
    .run();
  return c.json<ApiResponse>({ success: true, data: { id, is_active: newActive } });
});

// POST /api/sequences/:id/steps — add a step
apiRouter.post('/sequences/:id/steps', async (c) => {
  const seqId = c.req.param('id');
  const body = await c.req.json<{
    delay_minutes: number;
    message_type?: string;
    template_id?: string;
    message_content: string;
    media_url?: string;
    cta_title?: string;
    cta_url?: string;
  }>();

  if (!body.message_content) {
    return c.json<ApiResponse>({ success: false, error: 'message_content is required' }, 400);
  }

  // Get next step_order
  const last = await c.env.DB
    .prepare('SELECT MAX(step_order) as max_order FROM sequence_steps WHERE sequence_id = ?')
    .bind(seqId)
    .first<{ max_order: number | null }>();
  const nextOrder = (last?.max_order || 0) + 1;

  const stepId = generateId();
  await c.env.DB
    .prepare(`
      INSERT INTO sequence_steps (id, sequence_id, step_order, delay_minutes,
        message_type, template_id, message_content, media_url, cta_title, cta_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      stepId, seqId, nextOrder, body.delay_minutes || 0,
      body.message_type || 'text', body.template_id || null, body.message_content,
      body.media_url || null, body.cta_title || null, body.cta_url || null,
    )
    .run();

  const step = await c.env.DB.prepare('SELECT * FROM sequence_steps WHERE id = ?').bind(stepId).first();
  return c.json<ApiResponse>({ success: true, data: step }, 201);
});

// ─── Contacts ────────────────────────────────────────────────

// GET /api/contacts
apiRouter.get('/contacts', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '50'), 200);
  const offset = (page - 1) * limit;
  const oaId = c.req.query('oa_id');

  let query = 'SELECT * FROM contacts';
  let countQuery = 'SELECT COUNT(*) as total FROM contacts';
  const params: any[] = [];
  const countParams: any[] = [];
  if (oaId) {
    query += ' WHERE oa_id = ?';
    countQuery += ' WHERE oa_id = ?';
    params.push(oaId);
    countParams.push(oaId);
  }
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  const countRow = await c.env.DB.prepare(countQuery).bind(...countParams).first<{ total: number }>();

  return c.json<ApiResponse>({
    success: true,
    data: results,
    meta: { total: countRow?.total || 0, page, limit },
  });
});

// GET /api/contacts/:id
apiRouter.get('/contacts/:id', async (c) => {
  const contact = await c.env.DB
    .prepare('SELECT * FROM contacts WHERE id = ? OR zalo_user_id = ?')
    .bind(c.req.param('id'), c.req.param('id'))
    .first();
  if (!contact) return c.json<ApiResponse>({ success: false, error: 'Not found' }, 404);

  const { results: enrollments } = await c.env.DB
    .prepare('SELECT e.*, s.name as sequence_name FROM sequence_enrollments e JOIN sequences s ON s.id = e.sequence_id WHERE e.contact_id = ? ORDER BY e.enrolled_at DESC')
    .bind((contact as any).id)
    .all();

  return c.json<ApiResponse>({ success: true, data: { ...contact, enrollments } });
});

// ─── Enrollments ─────────────────────────────────────────────

// GET /api/enrollments
apiRouter.get('/enrollments', async (c) => {
  const status = c.req.query('status');
  const seqId = c.req.query('sequence_id');
  const oaId = c.req.query('oa_id');

  let query = `
    SELECT e.*, c.display_name, c.zalo_user_id, s.name as sequence_name
    FROM sequence_enrollments e
    JOIN contacts c ON c.id = e.contact_id
    JOIN sequences s ON s.id = e.sequence_id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (status) { query += ' AND e.status = ?'; params.push(status); }
  if (seqId) { query += ' AND e.sequence_id = ?'; params.push(seqId); }
  if (oaId) { query += ' AND c.oa_id = ?'; params.push(oaId); }
  query += ' ORDER BY e.enrolled_at DESC LIMIT 100';

  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json<ApiResponse>({ success: true, data: results, meta: { total: results.length } });
});

// POST /api/enrollments — manual enroll contact into sequence
apiRouter.post('/enrollments', async (c) => {
  const body = await c.req.json<{ contact_id: string; sequence_id: string }>();
  if (!body.contact_id || !body.sequence_id) {
    return c.json<ApiResponse>({ success: false, error: 'contact_id và sequence_id là bắt buộc' }, 400);
  }

  const engine = new SequenceEngine(c.env);
  await engine.enrollContact(body.contact_id, body.sequence_id);

  const enrollment = await c.env.DB
    .prepare('SELECT * FROM sequence_enrollments WHERE contact_id = ? AND sequence_id = ?')
    .bind(body.contact_id, body.sequence_id)
    .first();
  return c.json<ApiResponse>({ success: true, data: enrollment }, 201);
});

// ─── Contact Metadata ─────────────────────────────────────────

// GET /api/contacts/:id/metadata
apiRouter.get('/contacts/:id/metadata', async (c) => {
  const { results } = await c.env.DB
    .prepare('SELECT * FROM contact_metadata WHERE contact_id = ? ORDER BY field_key ASC')
    .bind(c.req.param('id'))
    .all();
  return c.json<ApiResponse>({ success: true, data: results });
});

// POST /api/contacts/:id/metadata
apiRouter.post('/contacts/:id/metadata', async (c) => {
  const contactId = c.req.param('id');
  const body = await c.req.json<{ field_key: string; field_value: string }>();

  if (!body.field_key) {
    return c.json<ApiResponse>({ success: false, error: 'field_key is required' }, 400);
  }

  const id = generateId();
  await c.env.DB
    .prepare('INSERT OR REPLACE INTO contact_metadata (id, contact_id, field_key, field_value) VALUES (?, ?, ?, ?)')
    .bind(id, contactId, body.field_key, body.field_value ?? null)
    .run();

  const record = await c.env.DB
    .prepare('SELECT * FROM contact_metadata WHERE contact_id = ? AND field_key = ?')
    .bind(contactId, body.field_key)
    .first();
  return c.json<ApiResponse>({ success: true, data: record }, 201);
});

// DELETE /api/contacts/:id/metadata/:key
apiRouter.delete('/contacts/:id/metadata/:key', async (c) => {
  await c.env.DB
    .prepare('DELETE FROM contact_metadata WHERE contact_id = ? AND field_key = ?')
    .bind(c.req.param('id'), c.req.param('key'))
    .run();
  return c.json<ApiResponse>({ success: true, data: { deleted: c.req.param('key') } });
});

// ─── Message Preview & Test Send ─────────────────────────────

// POST /api/messages/preview
apiRouter.post('/messages/preview', async (c) => {
  const body = await c.req.json<{ contact_id: string; template: string }>();
  if (!body.contact_id || !body.template) {
    return c.json<ApiResponse>({ success: false, error: 'contact_id và template là bắt buộc' }, 400);
  }

  const contact = await c.env.DB
    .prepare('SELECT * FROM contacts WHERE id = ? OR zalo_user_id = ?')
    .bind(body.contact_id, body.contact_id)
    .first<Contact>();
  if (!contact) return c.json<ApiResponse>({ success: false, error: 'Contact not found' }, 404);

  const rendered = await TemplateEngine.render(body.template, contact, c.env.DB);
  return c.json<ApiResponse>({
    success: true,
    data: { original: body.template, rendered },
  });
});

// POST /api/messages/test-send
apiRouter.post('/messages/test-send', async (c) => {
  const body = await c.req.json<{ contact_id: string; message_content: string }>();
  if (!body.contact_id || !body.message_content) {
    return c.json<ApiResponse>({ success: false, error: 'contact_id và message_content là bắt buộc' }, 400);
  }

  const contact = await c.env.DB
    .prepare('SELECT * FROM contacts WHERE id = ? OR zalo_user_id = ?')
    .bind(body.contact_id, body.contact_id)
    .first<Contact>();
  if (!contact) return c.json<ApiResponse>({ success: false, error: 'Contact not found' }, 404);

  const renderedContent = await TemplateEngine.render(body.message_content, contact, c.env.DB);

  const tm = new TokenManager(c.env.DB);
  const zaloApi = await tm.getZaloAPI();
  const result = await zaloApi.sendTextMessage(contact.zalo_user_id, renderedContent);

  const status = result.error === 0 ? 'sent' : 'failed';
  const logId = generateId();
  await c.env.DB
    .prepare(`
      INSERT INTO message_logs (id, contact_id, message_type, message_content, zalo_message_id, status, sent_at, created_at)
      VALUES (?, ?, 'text', ?, ?, ?, datetime('now'), datetime('now'))
    `)
    .bind(logId, contact.id, renderedContent, result.data?.message_id || null, status)
    .run();

  return c.json<ApiResponse>({
    success: result.error === 0,
    data: {
      zalo_user_id: contact.zalo_user_id,
      rendered_content: renderedContent,
      zalo_response: result,
      log_id: logId,
    },
  });
});

// ─── Message Logs & Analytics ─────────────────────────────────

// GET /api/message-logs
apiRouter.get('/message-logs', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '50'), 200);
  const offset = (page - 1) * limit;
  const contactId = c.req.query('contact_id');
  const status = c.req.query('status');
  const oaId = c.req.query('oa_id');

  let query = `
    SELECT ml.*, c.display_name, c.zalo_user_id
    FROM message_logs ml
    JOIN contacts c ON c.id = ml.contact_id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (contactId) { query += ' AND ml.contact_id = ?'; params.push(contactId); }
  if (status) { query += ' AND ml.status = ?'; params.push(status); }
  if (oaId) { query += ' AND ml.oa_id = ?'; params.push(oaId); }
  query += ' ORDER BY ml.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  let countQuery = 'SELECT COUNT(*) as total FROM message_logs WHERE 1=1';
  const countParams: any[] = [];
  if (contactId) { countQuery += ' AND contact_id = ?'; countParams.push(contactId); }
  if (status) { countQuery += ' AND status = ?'; countParams.push(status); }
  if (oaId) { countQuery += ' AND oa_id = ?'; countParams.push(oaId); }
  const countRow = await c.env.DB.prepare(countQuery).bind(...countParams).first<{ total: number }>();

  return c.json<ApiResponse>({
    success: true,
    data: results,
    meta: { total: countRow?.total || 0, page, limit },
  });
});

// ─── AI Config & Conversations ───────────────────────────────

// GET /api/ai/config
apiRouter.get('/ai/config', async (c) => {
  const config = await c.env.DB
    .prepare('SELECT * FROM ai_config WHERE id = ?')
    .bind('default')
    .first();
  if (!config) return c.json<ApiResponse>({ success: false, error: 'Config not found' }, 404);
  const masked = { ...config as any, api_key: (config as any).api_key ? '***' : null };
  return c.json<ApiResponse>({ success: true, data: masked });
});

// PUT /api/ai/config
apiRouter.put('/ai/config', async (c) => {
  const body = await c.req.json<{
    system_prompt?: string;
    model?: string;
    temperature?: number;
    escalation_keywords?: string;
    enabled?: number;
    api_key?: string;
    max_tokens?: number;
  }>();

  await c.env.DB
    .prepare(`
      UPDATE ai_config SET
        system_prompt = COALESCE(?, system_prompt),
        model = COALESCE(?, model),
        temperature = COALESCE(?, temperature),
        escalation_keywords = COALESCE(?, escalation_keywords),
        enabled = COALESCE(?, enabled),
        api_key = COALESCE(?, api_key),
        max_tokens = COALESCE(?, max_tokens),
        updated_at = datetime('now')
      WHERE id = 'default'
    `)
    .bind(
      body.system_prompt ?? null,
      body.model ?? null,
      body.temperature ?? null,
      body.escalation_keywords ?? null,
      body.enabled ?? null,
      body.api_key ?? null,
      body.max_tokens ?? null,
    )
    .run();

  const updated = await c.env.DB
    .prepare('SELECT * FROM ai_config WHERE id = ?')
    .bind('default')
    .first();
  const masked = { ...updated as any, api_key: (updated as any)?.api_key ? '***' : null };
  return c.json<ApiResponse>({ success: true, data: masked });
});

// GET /api/ai/conversations/:contactId
apiRouter.get('/ai/conversations/:contactId', async (c) => {
  const { results } = await c.env.DB
    .prepare('SELECT * FROM ai_conversations WHERE contact_id = ? ORDER BY created_at ASC')
    .bind(c.req.param('contactId'))
    .all();
  return c.json<ApiResponse>({ success: true, data: results, meta: { total: results.length } });
});

// DELETE /api/ai/conversations/:contactId
apiRouter.delete('/ai/conversations/:contactId', async (c) => {
  await c.env.DB
    .prepare('DELETE FROM ai_conversations WHERE contact_id = ?')
    .bind(c.req.param('contactId'))
    .run();
  return c.json<ApiResponse>({ success: true, data: { deleted: c.req.param('contactId') } });
});

// GET /api/analytics — comprehensive funnel + ROI
apiRouter.get('/analytics', async (c) => {
  const [
    totalContacts, activeFollowers, totalSequences, activeSequences,
    followsToday, follows7d, follows30d,
    sentToday, sent7d, sent30d, failedToday,
    totalDelivered, totalSent, totalRead,
    totalCostRow, costToday, cost7d, cost30d,
    totalConversionsRow, revenueRow,
    totalEnrolled, totalClickCta,
  ] = await Promise.all([
    c.env.DB.prepare("SELECT COUNT(*) as n FROM contacts").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM contacts WHERE is_following = 1").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM sequences").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM sequences WHERE is_active = 1").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM funnel_events WHERE event_type='follow' AND DATE(created_at)=DATE('now')").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM funnel_events WHERE event_type='follow' AND created_at >= datetime('now','-7 days')").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM funnel_events WHERE event_type='follow' AND created_at >= datetime('now','-30 days')").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM message_logs WHERE status='sent' AND DATE(created_at)=DATE('now')").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM message_logs WHERE status='sent' AND created_at >= datetime('now','-7 days')").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM message_logs WHERE status='sent' AND created_at >= datetime('now','-30 days')").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM message_logs WHERE status='failed' AND DATE(created_at)=DATE('now')").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM message_logs WHERE delivered_at IS NOT NULL").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM message_logs WHERE status='sent'").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM message_logs WHERE read_at IS NOT NULL").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COALESCE(SUM(cost_vnd),0) as t FROM message_logs").first<{ t: number }>(),
    c.env.DB.prepare("SELECT COALESCE(SUM(cost_vnd),0) as t FROM message_logs WHERE DATE(created_at)=DATE('now')").first<{ t: number }>(),
    c.env.DB.prepare("SELECT COALESCE(SUM(cost_vnd),0) as t FROM message_logs WHERE created_at >= datetime('now','-7 days')").first<{ t: number }>(),
    c.env.DB.prepare("SELECT COALESCE(SUM(cost_vnd),0) as t FROM message_logs WHERE created_at >= datetime('now','-30 days')").first<{ t: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM conversions").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COALESCE(SUM(value_vnd),0) as t FROM conversions").first<{ t: number }>(),
    c.env.DB.prepare("SELECT COUNT(DISTINCT contact_id) as n FROM sequence_enrollments").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as n FROM message_logs WHERE clicked_at IS NOT NULL").first<{ n: number }>(),
  ]);

  const tc = totalContacts?.n || 0;
  const totalSentN = totalSent?.n || 0;
  const totalDeliveredN = totalDelivered?.n || 0;
  const totalReadN = totalRead?.n || 0;
  const totalCostN = totalCostRow?.t || 0;
  const revenueN = revenueRow?.t || 0;
  const totalConversionsN = totalConversionsRow?.n || 0;

  const deliveryRate = totalSentN > 0 ? Math.round((totalDeliveredN / totalSentN) * 100) : 0;
  const readRate = totalDeliveredN > 0 ? Math.round((totalReadN / totalDeliveredN) * 100) : 0;
  const avgCostPerContact = tc > 0 ? Math.round(totalCostN / tc) : 0;
  const conversionRate = tc > 0 ? Math.round((totalConversionsN / tc) * 100) : 0;
  const roiPercentage = totalCostN > 0 ? Math.round(((revenueN - totalCostN) / totalCostN) * 100) : 0;

  const { results: hourlyRaw } = await c.env.DB
    .prepare(`
      SELECT CAST(strftime('%H', created_at) AS INTEGER) as hour,
        COUNT(*) as sent,
        SUM(CASE WHEN delivered_at IS NOT NULL THEN 1 ELSE 0 END) as delivered,
        SUM(CASE WHEN read_at IS NOT NULL THEN 1 ELSE 0 END) as read_count
      FROM message_logs WHERE status = 'sent'
      GROUP BY hour ORDER BY hour
    `)
    .all<{ hour: number; sent: number; delivered: number; read_count: number }>();

  const { results: topSeqRaw } = await c.env.DB
    .prepare(`
      SELECT s.name,
        COUNT(DISTINCT e.contact_id) as enrolled,
        SUM(CASE WHEN e.status='completed' THEN 1 ELSE 0 END) as completed,
        COUNT(DISTINCT cv.contact_id) as conversions
      FROM sequences s
      LEFT JOIN sequence_enrollments e ON e.sequence_id = s.id
      LEFT JOIN conversions cv ON cv.sequence_id = s.id
      GROUP BY s.id, s.name ORDER BY enrolled DESC LIMIT 10
    `)
    .all<{ name: string; enrolled: number; completed: number; conversions: number }>();

  return c.json<ApiResponse>({
    success: true,
    data: {
      overview: {
        total_contacts: tc,
        active_followers: activeFollowers?.n || 0,
        total_sequences: totalSequences?.n || 0,
        active_sequences: activeSequences?.n || 0,
      },
      funnel: {
        follows_today: followsToday?.n || 0,
        follows_7d: follows7d?.n || 0,
        follows_30d: follows30d?.n || 0,
        messages_sent_today: sentToday?.n || 0,
        messages_sent_7d: sent7d?.n || 0,
        messages_sent_30d: sent30d?.n || 0,
        messages_failed_today: failedToday?.n || 0,
        delivery_rate: deliveryRate,
        read_rate: readRate,
        total_follows: follows30d?.n || 0,
        total_enrolled: totalEnrolled?.n || 0,
        total_sent: totalSentN,
        total_delivered: totalDeliveredN,
        total_read: totalReadN,
        total_click_cta: totalClickCta?.n || 0,
        total_conversions: totalConversionsN,
      },
      cost: {
        total_cost_vnd: totalCostN,
        cost_today: costToday?.t || 0,
        cost_7d: cost7d?.t || 0,
        cost_30d: cost30d?.t || 0,
        avg_cost_per_contact: avgCostPerContact,
      },
      conversions: {
        total_conversions: totalConversionsN,
        revenue_vnd: revenueN,
        conversion_rate: conversionRate,
        roi_percentage: roiPercentage,
      },
      hourly_heatmap: (hourlyRaw || []).map(r => ({ hour: r.hour, sent: r.sent, delivered: r.delivered, read: r.read_count })),
      top_sequences: (topSeqRaw || []).map(r => ({
        name: r.name,
        enrolled: r.enrolled,
        completed: r.completed,
        conversion_rate: r.enrolled > 0 ? Math.round((r.conversions / r.enrolled) * 100) : 0,
      })),
    },
  });
});

// POST /api/conversions
apiRouter.post('/conversions', async (c) => {
  const body = await c.req.json<{ contact_id: string; sequence_id?: string; conversion_type?: string; value_vnd?: number; notes?: string }>();
  if (!body.contact_id) {
    return c.json<ApiResponse>({ success: false, error: 'contact_id is required' }, 400);
  }
  const id = generateId();
  await c.env.DB
    .prepare(`INSERT INTO conversions (id, contact_id, sequence_id, conversion_type, value_vnd, notes) VALUES (?, ?, ?, ?, ?, ?)`)
    .bind(id, body.contact_id, body.sequence_id || null, body.conversion_type || 'purchase', body.value_vnd || 0, body.notes || null)
    .run();
  const created = await c.env.DB.prepare('SELECT * FROM conversions WHERE id = ?').bind(id).first();
  return c.json<ApiResponse>({ success: true, data: created }, 201);
});

// GET /api/conversions
apiRouter.get('/conversions', async (c) => {
  const from = c.req.query('from');
  const to = c.req.query('to');
  let query = 'SELECT cv.*, c.display_name FROM conversions cv LEFT JOIN contacts c ON c.id = cv.contact_id WHERE 1=1';
  const params: any[] = [];
  if (from) { query += ' AND cv.created_at >= ?'; params.push(from); }
  if (to) { query += ' AND cv.created_at <= ?'; params.push(to); }
  query += ' ORDER BY cv.created_at DESC LIMIT 100';
  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json<ApiResponse>({ success: true, data: results, meta: { total: results.length } });
});

// GET /api/funnel/:contactId
apiRouter.get('/funnel/:contactId', async (c) => {
  const contactId = c.req.param('contactId');
  const contact = await c.env.DB
    .prepare('SELECT id, display_name, zalo_user_id, followed_at, is_following FROM contacts WHERE id = ?')
    .bind(contactId)
    .first();
  if (!contact) return c.json<ApiResponse>({ success: false, error: 'Contact not found' }, 404);

  const [{ results: events }, { results: enrollments }, { results: messages }, { results: conversions }] = await Promise.all([
    c.env.DB.prepare('SELECT * FROM funnel_events WHERE contact_id = ? ORDER BY created_at ASC').bind(contactId).all(),
    c.env.DB.prepare('SELECT e.*, s.name as sequence_name FROM sequence_enrollments e JOIN sequences s ON s.id = e.sequence_id WHERE e.contact_id = ?').bind(contactId).all(),
    c.env.DB.prepare('SELECT id, status, sent_at, delivered_at, read_at, clicked_at FROM message_logs WHERE contact_id = ? ORDER BY created_at DESC LIMIT 20').bind(contactId).all(),
    c.env.DB.prepare('SELECT * FROM conversions WHERE contact_id = ? ORDER BY created_at DESC').bind(contactId).all(),
  ]);

  return c.json<ApiResponse>({ success: true, data: { contact, events, enrollments, messages, conversions } });
});
