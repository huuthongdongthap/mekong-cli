import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sign, verify } from 'hono/jwt';
import { withDb } from '../middleware/db';

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  ZALO_APP_ID: string;
  ZALO_APP_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const loginSchema = z.object({
  code: z.string().min(1),
  redirect_uri: z.string().optional(),
});

const refreshSchema = z.object({
  refresh_token: z.string(),
});

const phoneSchema = z.object({
  phone: z.string().regex(/^(\+84|0)[3-9][0-9]{8}$/, 'Invalid VN phone'),
});

app.get('/health', (c) => c.json({ status: 'ok', service: 'auth' }));

app.post('/login/zalo', zValidator('json', loginSchema), async (c) => {
  const { code, redirect_uri } = c.req.valid('json');
  const { ZALO_APP_ID, ZALO_APP_SECRET, DB } = c.env;

  try {
    const tokenRes = await fetch('https://oauth.zaloapp.com/v4/oa/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code, app_id: ZALO_APP_ID, app_secret: ZALO_APP_SECRET,
        ...(redirect_uri ? { redirect_uri } : {}),
      }),
    });
    if (!tokenRes.ok) return c.json({ error: 'Zalo OAuth failed' }, 401);
    const tokenData = await tokenRes.json<{ access_token: string; refresh_token: string; expires_in: number }>();

    const profileRes = await fetch('https://graph.zaloapp.com/v2.0/me?fields=id,name,picture', {
      headers: { access_token: tokenData.access_token },
    });
    if (!profileRes.ok) return c.json({ error: 'Failed to get Zalo profile' }, 401);
    const profile = await profileRes.json<{ id: string; name: string; picture?: { data?: { url?: string } } }>();

    const existingUser = await DB.prepare('SELECT id, name, phone, tier, credits FROM users WHERE zalo_id = ?').bind(profile.id).first();
    let userId: string;
    let isNewUser = false;

    if (existingUser) {
      userId = existingUser.id as string;
      await DB.prepare('UPDATE users SET zalo_access_token = ?, zalo_refresh_token = ?, updated_at = datetime("now") WHERE id = ?').bind(tokenData.access_token, tokenData.refresh_token, userId).run();
    } else {
      const newUser = await DB.prepare('INSERT INTO users (zalo_id, zalo_access_token, zalo_refresh_token, name, tier, credits, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime("now"))').bind(profile.id, tokenData.access_token, tokenData.refresh_token, profile.name, 'trial', 50, Date.now()).run();
      userId = newUser.meta.last_row_id as string;
      isNewUser = true;
    }

    const jwtPayload = { sub: userId, zalo_id: profile.id, name: profile.name, tier: (existingUser?.tier as string) || 'trial', iat: Math.floor(Date.now() / 1000) };
    const accessToken = await sign(jwtPayload, c.env.JWT_SECRET, '24h');
    const refreshToken = await sign({ ...jwtPayload, type: 'refresh' }, c.env.JWT_SECRET, '30d');

    return c.json({ access_token: accessToken, refresh_token: refreshToken, expires_in: 86400, user: { id: userId, name: profile.name, avatar: profile.picture?.data?.url, tier: (existingUser?.tier as string) || 'trial', is_new: isNewUser } });
  } catch (err) {
    console.error('Zalo login error:', err);
    return c.json({ error: 'Authentication failed' }, 500);
  }
});

app.post('/refresh', zValidator('json', refreshSchema), async (c) => {
  const { refresh_token } = c.req.valid('json');
  try {
    const decoded = await verify(refresh_token, c.env.JWT_SECRET) as any;
    if (decoded.type !== 'refresh') return c.json({ error: 'Invalid token type' }, 401);
    const newAccessToken = await sign({ sub: decoded.sub, zalo_id: decoded.zalo_id, name: decoded.name, tier: decoded.tier }, c.env.JWT_SECRET, '24h');
    return c.json({ access_token: newAccessToken, expires_in: 86400 });
  } catch {
    return c.json({ error: 'Invalid refresh token' }, 401);
  }
});

app.post('/link-phone', zValidator('json', phoneSchema), async (c) => {
  const { phone } = c.req.valid('json');
  const authHeader = c.req.header('authorization');
  if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = await verify(token, c.env.JWT_SECRET) as any;
    const userId = decoded.sub;
    await c.env.DB.prepare('UPDATE users SET phone = ? WHERE id = ?').bind(phone, userId).run();
    return c.json({ success: true, phone });
  } catch {
    return c.json({ error: 'Failed to link phone' }, 500);
  }
});

// Auth middleware — use with .use() in sub-apps
export async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header('authorization');
  if (!authHeader) return c.json({ error: 'Missing authorization header' }, 401);
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = await verify(token, c.env.JWT_SECRET);
    if (decoded.type === 'refresh') return c.json({ error: 'Use refresh token' }, 401);
    c.set('user', decoded);
    await next();
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }
}

export default app;
