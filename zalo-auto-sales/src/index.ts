// Zalo Auto Sales — Cloudflare Worker Entry Point

import { Hono } from 'hono';
import type { Env } from './types';
import { loginRouter } from './routes/login';
import { apiRouter } from './routes/api';
import { webhookRouter } from './routes/webhook';
import { TokenManager } from './lib/token-manager';
import { SequenceEngine } from './lib/sequence-engine';
import { DASHBOARD_HTML } from './dashboard';

const app = new Hono<{ Bindings: Env }>();

// ─── Routes ──────────────────────────────────────────────────

app.route('/', loginRouter);      // GET /login, POST /login/start, GET /oauth/callback
app.route('/api', apiRouter);     // GET|POST|PUT|DELETE|PATCH /api/*
app.route('/', webhookRouter);    // POST /webhook

// GET / — dashboard if configured, else redirect to /login
app.get('/', async (c) => {
  const tm = new TokenManager(c.env.DB);
  const tokens = await tm.getTokens();
  if (!tokens?.app_id) {
    return c.redirect('/login');
  }
  return c.html(DASHBOARD_HTML);
});

// ─── Cloudflare Worker Export ─────────────────────────────────

export default {
  fetch: app.fetch,

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      (async () => {
        const engine = new SequenceEngine(env);
        await engine.processDueMessages();
      })(),
    );
  },
};
