/**
 * Mekong OPB API — Cloudflare Workers
 * Main entry point: mounts all route modules
 */
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import auth from './auth';
import invoice from './invoice';
import tax from './tax';
import zalo from './zalo';
import sales from './sales';
import nurture from './nurture';
import referral from './referral';
import churn from './churn';
import pilot from './pilot';

type Bindings = {
  DB: D1Database;
  KV: KVNamespace;
  R2: Bucket;
  JWT_SECRET: string;
  ZALO_APP_ID: string;
  ZALO_APP_SECRET: string;
  ZALO_VERIFY_TOKEN: string;
  OPENROUTER_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));
app.use('*', prettyJSON());

// Health check
app.get('/health', (c) => c.json({
  status: 'ok',
  service: 'mekong-opb-api',
  timestamp: new Date().toISOString(),
}));

// API routes
app.route('/auth', auth);
app.route('/invoices', invoice);
app.route('/tax', tax);
app.route('/zalo', zalo);
app.route('/sales', sales);
app.route('/nurture', nurture);
app.route('/referral', referral);
app.route('/churn', churn);
app.route('/pilot', pilot);

// 404
app.notFound((c) => c.json({ error: 'Not found' }, 404));

// Error handler
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
