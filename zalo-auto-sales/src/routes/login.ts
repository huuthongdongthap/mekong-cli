// Login / Zalo OAuth Setup Routes
// Flow: GET /login → POST /login/start → Zalo OAuth → GET /oauth/callback

import { Hono } from 'hono';
import type { Env } from '../types';
import { ZaloAPI } from '../lib/zalo-api';
import { TokenManager } from '../lib/token-manager';

const ZALO_AUTH_URL = 'https://oauth.zaloapp.com/v4/oa/permission';

export const loginRouter = new Hono<{ Bindings: Env }>();

// GET /login — Setup page
loginRouter.get('/login', async (c) => {
  const tm = new TokenManager(c.env.DB);
  const existing = await tm.getTokens();

  const statusBadge = existing?.app_id
    ? `<p class="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 mb-4">
        ✓ Đã kết nối OA ID: <strong>${existing.oa_id || 'N/A'}</strong>
        &nbsp;|&nbsp; App: <strong>${existing.app_id}</strong>
        &nbsp;|&nbsp; Token hết hạn: <strong>${existing.access_token_expires_at || '?'}</strong>
      </p>`
    : `<p class="text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded-md px-3 py-2 mb-4">
        ⚠ Chưa kết nối Zalo OA. Nhập thông tin bên dưới để bắt đầu.
      </p>`;
  const oaNameField = `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">OA Name <span class="text-gray-400 font-normal">(tuỳ chọn)</span></label>
        <input name="display_name" value="${existing?.display_name || ''}" autocomplete="off"
          class="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="VD: OA Thời trang, OA Mỹ phẩm">
        <p class="text-xs text-gray-400 mt-1">Tên hiển thị để phân biệt các OA trong dashboard</p>
      </div>`;

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zalo OA — Kết nối tài khoản</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">Z</div>
      <div>
        <h1 class="text-xl font-bold text-gray-900">Zalo Auto Sales</h1>
        <p class="text-xs text-gray-500">OA OAuth Setup</p>
      </div>
    </div>

    ${statusBadge}

    <form method="POST" action="/login/start" class="space-y-4">
      ${oaNameField}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">App ID <span class="text-red-500">*</span></label>
        <input name="app_id" value="${existing?.app_id || ''}" required autocomplete="off"
          class="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">App Secret <span class="text-red-500">*</span></label>
        <input name="app_secret" type="password" value="${existing?.app_secret || ''}" required autocomplete="new-password"
          class="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">OA ID</label>
        <input name="oa_id" value="${existing?.oa_id || ''}" autocomplete="off"
          class="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Lấy từ Zalo OA Dashboard">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">OA Secret Key (Webhook)</label>
        <input name="oa_secret_key" type="password" value="${existing?.oa_secret_key || ''}" autocomplete="new-password"
          class="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Dùng để verify webhook signature">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Redirect URI</label>
        <input name="redirect_uri" id="redirectUri" autocomplete="off"
          class="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://your-worker.workers.dev/oauth/callback">
        <p class="text-xs text-gray-400 mt-1">URL callback — phải khớp với cấu hình trên Zalo Developer Console</p>
      </div>
      <button type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors">
        Kết nối Zalo OA →
      </button>
    </form>

    <p class="text-xs text-center text-gray-400 mt-6">
      Sau khi kết nối, bạn sẽ được chuyển hướng về trang dashboard.
    </p>
  </div>

  <script>
    const input = document.getElementById('redirectUri');
    if (!input.value) {
      input.value = window.location.origin + '/oauth/callback';
    }
  </script>
</body>
</html>`;

  return c.html(html);
});

// POST /login/start — Save credentials + redirect to Zalo OAuth
loginRouter.post('/login/start', async (c) => {
  const body = await c.req.parseBody();
  const app_id = String(body.app_id || '').trim();
  const app_secret = String(body.app_secret || '').trim();
  const oa_id = String(body.oa_id || '').trim();
  const oa_secret_key = String(body.oa_secret_key || '').trim();
  const display_name = String(body.display_name || '').trim();
  const redirect_uri = String(body.redirect_uri || '').trim()
    || new URL(c.req.url).origin + '/oauth/callback';

  if (!app_id || !app_secret) {
    return c.text('app_id và app_secret là bắt buộc.', 400);
  }

  // Persist credentials under 'default' temp key; will be re-keyed after OAuth
  const tm = new TokenManager(c.env.DB);
  await tm.saveTokens('default', {
    app_id,
    app_secret,
    oa_id: oa_id || undefined,
    oa_secret_key: oa_secret_key || undefined,
    display_name: display_name || undefined,
  });

  // Build Zalo OAuth consent URL
  const authUrl = new URL(ZALO_AUTH_URL);
  authUrl.searchParams.set('app_id', app_id);
  authUrl.searchParams.set('redirect_uri', redirect_uri);

  return c.redirect(authUrl.toString());
});

// GET /oauth/callback — Exchange authorization code for tokens
loginRouter.get('/oauth/callback', async (c) => {
  const code = c.req.query('code');
  const oa_id_from_zalo = c.req.query('oa_id');

  if (!code) {
    return c.html(`<!DOCTYPE html><html><head><title>Error</title>
      <script src="https://cdn.tailwindcss.com"></script></head>
      <body class="flex items-center justify-center min-h-screen bg-red-50">
        <div class="text-center">
          <p class="text-red-600 font-semibold">Lỗi: Không nhận được authorization code từ Zalo.</p>
          <a href="/login" class="mt-4 inline-block text-blue-600 underline">← Thử lại</a>
        </div>
      </body></html>`, 400);
  }

  const tm = new TokenManager(c.env.DB);
  // Load temp credentials saved under 'default' during /login/start
  const existing = await tm.getTokens('default');

  if (!existing?.app_id || !existing?.app_secret) {
    return c.html(`<!DOCTYPE html><html><head><title>Error</title>
      <script src="https://cdn.tailwindcss.com"></script></head>
      <body class="flex items-center justify-center min-h-screen bg-red-50">
        <div class="text-center">
          <p class="text-red-600 font-semibold">Lỗi: Chưa lưu App credentials. Vui lòng bắt đầu từ /login.</p>
          <a href="/login" class="mt-4 inline-block text-blue-600 underline">← Quay lại Login</a>
        </div>
      </body></html>`, 400);
  }

  let tokenResp;
  try {
    tokenResp = await ZaloAPI.exchangeCode(existing.app_id, existing.app_secret, code);
  } catch (e: any) {
    return c.text(`OAuth exchange thất bại: ${e.message}`, 500);
  }

  if (tokenResp.error && tokenResp.error !== 0) {
    return c.html(`<!DOCTYPE html><html><head><title>Error</title>
      <script src="https://cdn.tailwindcss.com"></script></head>
      <body class="flex items-center justify-center min-h-screen bg-red-50">
        <div class="text-center">
          <p class="text-red-600 font-semibold">Zalo trả về lỗi: ${tokenResp.message || tokenResp.error}</p>
          <a href="/login" class="mt-4 inline-block text-blue-600 underline">← Thử lại</a>
        </div>
      </body></html>`, 400);
  }

  const expiresAt = new Date(Date.now() + (tokenResp.expires_in || 3600) * 1000).toISOString();

  // Use the real Zalo OA ID as the token record key (fallback to 'default')
  const recordId = oa_id_from_zalo || 'default';
  await tm.saveTokens(recordId, {
    access_token: tokenResp.access_token,
    refresh_token: tokenResp.refresh_token,
    access_token_expires_at: expiresAt,
    oa_id: oa_id_from_zalo || existing.oa_id || undefined,
    app_id: existing.app_id,
    app_secret: existing.app_secret,
    oa_secret_key: existing.oa_secret_key || undefined,
    display_name: existing.display_name || undefined,
  });

  return c.redirect('/');
});
