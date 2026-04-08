// Webhook Handler — Zalo OA event receiver
// Must respond within 2s; offload DB work to ctx.waitUntil()

import { Hono } from 'hono';
import type { Env, ZaloWebhookEvent } from '../types';
import { verifyWebhookSignature } from '../lib/zalo-api';
import { TokenManager } from '../lib/token-manager';
import { SequenceEngine } from '../lib/sequence-engine';
import { AIService } from '../lib/ai-service';
import { generateId } from '../lib/utils';

export const webhookRouter = new Hono<{ Bindings: Env }>();

// POST /webhook
webhookRouter.post('/webhook', async (c) => {
  // Read body as raw text (required for signature validation)
  const bodyText = await c.req.text();

  // Extract Zalo signature headers
  const appId = c.req.header('X-ZApp-Id') || '';
  const timestamp = c.req.header('X-ZTimestamp') || '';
  const signature = c.req.header('X-ZEvent-Signature') || '';

  // Validate signature (skip if oa_secret_key not yet configured)
  const tm = new TokenManager(c.env.DB);
  const tokens = await tm.getTokens();

  if (tokens?.oa_secret_key && signature) {
    const valid = await verifyWebhookSignature(
      appId, bodyText, timestamp, tokens.oa_secret_key, signature,
    );
    if (!valid) {
      return c.json({ error: 1, message: 'Invalid signature' }, 401);
    }
  }

  // Parse event payload
  let payload: ZaloWebhookEvent;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return c.json({ error: 1, message: 'Invalid JSON payload' }, 400);
  }

  // Offload all DB work — respond to Zalo within 2 seconds
  c.executionCtx.waitUntil(handleEvent(c.env, payload));

  return c.json({ error: 0, message: 'Success' });
});

// ─── Event Handlers ──────────────────────────────────────────

async function handleEvent(env: Env, event: ZaloWebhookEvent): Promise<void> {
  try {
    switch (event.event_name) {
      case 'follow':
        await handleFollow(env, event);
        break;
      case 'unfollow':
        await handleUnfollow(env, event);
        break;
      case 'user_send_text':
        await handleUserSendText(env, event);
        break;
      default:
        console.log(`[Webhook] Unhandled event: ${event.event_name}`);
    }
  } catch (err: any) {
    console.error(`[Webhook] Error handling event ${event.event_name}:`, err.message);
  }
}

/** User followed OA → upsert contact, auto-enroll into 'follow' sequences */
async function handleFollow(env: Env, event: ZaloWebhookEvent): Promise<void> {
  const zaloUserId = event.follower?.id || event.user_id_by_app;
  const oaId = event.oa_id || 'default';
  if (!zaloUserId) return;

  // Upsert contact
  const existing = await env.DB
    .prepare('SELECT id FROM contacts WHERE zalo_user_id = ? AND oa_id = ?')
    .bind(zaloUserId, oaId)
    .first<{ id: string }>();

  let contactId: string;

  if (existing) {
    contactId = existing.id;
    await env.DB
      .prepare("UPDATE contacts SET is_following = 1, followed_at = datetime('now'), updated_at = datetime('now') WHERE id = ?")
      .bind(contactId)
      .run();
  } else {
    contactId = generateId();
    await env.DB
      .prepare(`
        INSERT INTO contacts (id, zalo_user_id, oa_id, is_following, followed_at)
        VALUES (?, ?, ?, 1, datetime('now'))
      `)
      .bind(contactId, zaloUserId, oaId)
      .run();
  }

  // Track funnel event
  await env.DB
    .prepare(`INSERT INTO funnel_events (id, contact_id, event_type, oa_id, created_at) VALUES (?, ?, 'follow', ?, datetime('now'))`)
    .bind(generateId(), contactId, oaId)
    .run();

  // Auto-enroll into all active 'follow' sequences for this OA
  const engine = new SequenceEngine(env);
  await engine.autoEnrollByEvent(contactId, 'follow', undefined, oaId);

  console.log(`[Webhook] Follow: contact ${contactId} (${zaloUserId}) OA=${oaId} upserted and enrolled`);
}

/** User unfollowed OA → mark inactive, cancel active enrollments */
async function handleUnfollow(env: Env, event: ZaloWebhookEvent): Promise<void> {
  const zaloUserId = event.follower?.id || event.user_id_by_app;
  if (!zaloUserId) return;

  const contact = await env.DB
    .prepare('SELECT id FROM contacts WHERE zalo_user_id = ?')
    .bind(zaloUserId)
    .first<{ id: string }>();

  if (!contact) return;

  await env.DB
    .prepare("UPDATE contacts SET is_following = 0, updated_at = datetime('now') WHERE id = ?")
    .bind(contact.id)
    .run();

  await env.DB
    .prepare("UPDATE sequence_enrollments SET status = 'cancelled', paused_at = datetime('now') WHERE contact_id = ? AND status = 'active'")
    .bind(contact.id)
    .run();

  // Track funnel event
  await env.DB
    .prepare(`INSERT INTO funnel_events (id, contact_id, event_type, oa_id, created_at) VALUES (?, ?, 'unfollow', ?, datetime('now'))`)
    .bind(generateId(), contact.id, event.oa_id || 'default')
    .run();

  console.log(`[Webhook] Unfollow: contact ${contact.id} (${zaloUserId}) deactivated, enrollments cancelled`);
}

/** User sent text → update last_interaction_at, check keyword triggers */
async function handleUserSendText(env: Env, event: ZaloWebhookEvent): Promise<void> {
  const zaloUserId = event.sender?.id || event.user_id_by_app;
  const oaId = event.oa_id || 'default';
  const messageText = event.message?.text || '';
  if (!zaloUserId) return;

  // Upsert contact (in case they never followed)
  const existing = await env.DB
    .prepare('SELECT id FROM contacts WHERE zalo_user_id = ? AND oa_id = ?')
    .bind(zaloUserId, oaId)
    .first<{ id: string }>();

  let contactId: string;

  if (existing) {
    contactId = existing.id;
  } else {
    contactId = generateId();
    await env.DB
      .prepare("INSERT INTO contacts (id, zalo_user_id, oa_id, is_following) VALUES (?, ?, ?, 0)")
      .bind(contactId, zaloUserId, oaId)
      .run();
  }

  // Update last_interaction_at (resets 48h free window)
  await env.DB
    .prepare("UPDATE contacts SET last_interaction_at = datetime('now'), updated_at = datetime('now') WHERE id = ?")
    .bind(contactId)
    .run();

  // Track funnel event
  await env.DB
    .prepare(`INSERT INTO funnel_events (id, contact_id, event_type, oa_id, created_at) VALUES (?, ?, 'message_received', ?, datetime('now'))`)
    .bind(generateId(), contactId, oaId)
    .run();

  // AI auto-reply using the correct OA token
  if (messageText) {
    try {
      const aiService = new AIService(env.DB);
      const config = await aiService.getConfig();
      if (config.enabled) {
        const { reply, shouldEscalate } = await aiService.generateReply(contactId, messageText);
        const tm = new TokenManager(env.DB);
        const zaloApi = await tm.getZaloAPI(oaId);
        if (shouldEscalate) {
          await zaloApi.sendTextMessage(zaloUserId, 'Cảm ơn bạn, mình sẽ chuyển cho nhân viên hỗ trợ ngay ạ!');
        } else if (reply) {
          await zaloApi.sendTextMessage(zaloUserId, reply);
        }
      }
    } catch (err: any) {
      console.error('[Webhook] AI reply error:', err.message);
    }
  }

  // Keyword trigger — filter sequences by this OA
  if (messageText) {
    const engine = new SequenceEngine(env);
    await engine.autoEnrollByEvent(contactId, 'keyword', messageText, oaId);
  }

  console.log(`[Webhook] UserSendText: ${zaloUserId} OA=${oaId} → "${messageText.slice(0, 50)}"`);
}
