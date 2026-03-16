# CLAUDE.md — Mekong Agency (Sa Đéc Marketing Hub)

> File này là nguồn sự thật duy nhất (single source of truth) cho mọi AI agent làm việc trên repo.
> Đọc TOÀN BỘ trước khi thực hiện bất kỳ thay đổi nào.

---

## 1. Tổng quan dự án

**Mekong Agency** (codename: AgencyOS 2026) là nền tảng digital marketing cho SME vùng ĐBSCL.

| Thuộc tính | Giá trị |
|---|---|
| Live URL | `https://sadec-marketing-hub.pages.dev` |
| Repo | `huuthongdongthap/sadec-marketing-hub` |
| Branch chính | `main` |
| Hosting | Cloudflare Pages |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions + Realtime) |
| AI | Google Gemini API (qua Edge Functions) |
| Triết lý | **No-Build** — Vanilla JS (ES Modules), HTML5, CSS3. KHÔNG framework. |

### Các module chính

- **Landing Page** (`index.html`) — Trang giới thiệu, pricing, case study, form liên hệ
- **Admin Dashboard** (`admin/`) — CRM Leads, Campaigns, Finance, Content Calendar
- **Client Portal** (`portal/`) — Dashboard khách hàng, báo cáo realtime
- **Affiliate System** (`affiliate/`) — Referral tracking, commission management
- **Auth** (`auth/`) — Đăng nhập/đăng ký thống nhất, RBAC

### Roles (RBAC)

```
super_admin → Full access
manager     → Campaigns, Leads, Reports
content     → Content Calendar, AI Tools
client      → Read-only: own projects & invoices
affiliate   → Referral dashboard only
```

---

## 2. Kiến trúc & cấu trúc thư mục

```
/
├── admin/                  # Admin pages (mỗi file = 1 module)
│   ├── leads.html          # CRM Pipeline (Kanban)
│   ├── campaigns.html      # Campaign Manager
│   ├── finance.html        # P&L, Cash Flow, Invoicing
│   └── content.html        # Content Calendar
├── portal/                 # Client-facing pages
│   ├── dashboard.html
│   └── projects.html
├── affiliate/              # Affiliate partner pages
├── auth/                   # Login, Register, Forgot Password
├── assets/
│   ├── css/
│   │   ├── m3-agency.css   # ⭐ Core Design Tokens (M3 Expressive)
│   │   └── admin-unified.css
│   ├── js/
│   │   ├── auth.js         # ⭐ Centralized Auth & RBAC
│   │   ├── utils.js        # MekongUtils (formatters, helpers)
│   │   └── components/     # Web Components (<sadec-sidebar>, etc.)
│   └── images/
├── database/               # SQL migrations & seeds
│   ├── migrations/         # Numbered: 001_xxx.sql, 002_xxx.sql
│   └── seeds/
├── supabase/
│   └── functions/          # Edge Functions (Deno/TypeScript)
├── workers/                # Cloudflare Workers
├── docs/                   # Documentation (DI CHUYỂN reports vào đây)
├── tests/                  # Test files
└── scripts/                # Build/deploy utilities
```

### ⚠️ QUY TẮC TUYỆT ĐỐI VỀ CẤU TRÚC

1. **KHÔNG tạo file .md ở root directory** — Mọi tài liệu mới PHẢI nằm trong `docs/` với thư mục con phù hợp:
   - `docs/releases/` — Release notes
   - `docs/audits/` — Audit reports, code quality
   - `docs/performance/` — Performance reports
   - `docs/tech-debt/` — Tech debt tracking
   - `docs/sprints/` — Sprint reports, PR reviews

2. **KHÔNG tạo thư mục ẩn mới ở root** — Đã có quá nhiều (`.agent/`, `.agents/`, `.claude/`, `.gemini/`, `.knowledge/`, `.scripts/`, `.tasks/`). Sử dụng cái đã có hoặc hỏi trước khi tạo mới.

3. **KHÔNG commit file tạm** — `.coverage`, `*.log`, `node_modules/`, `.env`, `*.tmp` phải nằm trong `.gitignore`

---

## 3. Tech Stack — Quy tắc nghiêm ngặt

### 3.1 JavaScript — Vanilla ES Modules ONLY

```javascript
// ✅ ĐÚNG — ES Modules
import { MekongUtils } from '/assets/js/utils.js';
export function createLead(data) { ... }

// ❌ SAI — CommonJS
const utils = require('./utils');
module.exports = { ... };

// ✅ ĐÚNG — Fetch API
const response = await fetch('/api/leads');

// ❌ SAI — Axios, jQuery, hoặc bất kỳ library nào
$.ajax({ ... });
```

**Quy tắc JS:**
- Sử dụng `async/await` (KHÔNG `.then()` chains)
- Sử dụng `const` mặc định, `let` khi cần reassign, KHÔNG BAO GIỜ `var`
- Template literals cho string interpolation
- Optional chaining (`?.`) và nullish coalescing (`??`) 
- Destructuring cho objects và arrays
- KHÔNG sử dụng TypeScript trong frontend (xem mục 3.5)

### 3.2 CSS — Material Design 3 (Expressive) + Custom Properties

```css
/* ✅ ĐÚNG — CSS Custom Properties */
:root {
  --md-primary: #1B5E3B;
  --md-on-primary: #FFFFFF;
  --md-surface: #FFF8F0;
  --md-radius-md: 12px;
}

.card {
  background: var(--md-surface);
  border-radius: var(--md-radius-md);
}

/* ❌ SAI — Hardcoded values, Tailwind, SCSS */
.card { background: #FFF8F0; border-radius: 12px; }
```

**Quy tắc CSS:**
- KHÔNG Tailwind, KHÔNG SCSS/LESS, KHÔNG PostCSS
- Sử dụng CSS Custom Properties cho theming
- Mobile-first responsive (`min-width` media queries)
- BEM naming cho components: `.block__element--modifier`
- File chính: `m3-agency.css` chứa tất cả design tokens

### 3.3 HTML — Semantic, Accessible

```html
<!-- ✅ ĐÚNG -->
<section id="services" aria-labelledby="services-heading">
  <h2 id="services-heading">Dịch vụ</h2>
  <article class="service-card">...</article>
</section>

<!-- ❌ SAI -->
<div class="section">
  <div class="title">Dịch vụ</div>
  <div class="card">...</div>
</div>
```

**Quy tắc HTML:**
- Semantic tags: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- ARIA labels cho interactive elements
- Một `<h1>` duy nhất trên mỗi trang
- `loading="lazy"` cho images below the fold
- `alt` text cho tất cả `<img>`
- Tiếng Việt: sử dụng `lang="vi"` trên `<html>`

### 3.4 Supabase

```javascript
// ✅ ĐÚNG — Sử dụng singleton client từ auth.js
import { getSupabaseClient } from '/assets/js/auth.js';
const supabase = getSupabaseClient();

// ❌ SAI — Tạo client mới
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key);
```

**Quy tắc Supabase:**
- LUÔN sử dụng Row Level Security (RLS) — KHÔNG BAO GIỜ bypass
- Edge Functions cho server-side logic (Deno runtime)
- Realtime subscriptions cho data cần update live
- Migrations đặt tên: `XXX_descriptive_name.sql` (numbered)
- KHÔNG hardcode Supabase credentials — lấy từ `mekong-env.js`

### 3.5 TypeScript — CHỈ cho Supabase Edge Functions

```
supabase/functions/  → TypeScript OK (Deno runtime)
workers/             → TypeScript OK (Cloudflare Workers)
assets/js/           → Vanilla JS ONLY (no TS)
admin/               → Vanilla JS ONLY
portal/              → Vanilla JS ONLY
```

Nếu cần type safety cho frontend JS, sử dụng **JSDoc comments**:
```javascript
/**
 * @param {string} leadId
 * @param {'hot'|'warm'|'cold'} score
 * @returns {Promise<{success: boolean, data?: Lead}>}
 */
export async function updateLeadScore(leadId, score) { ... }
```

---

## 4. Quy trình làm việc Multi-Agent

### Kiến trúc agent hiện tại

```
┌─────────────────────────────────────┐
│  CTO Agent (Ollama Qwen 3.0 32B)   │  ← Lên kế hoạch, review, quyết định
│  Chạy trên: Antigravity             │     kiến trúc, phân task
└──────────────┬──────────────────────┘
               │ Coding Plan
               ▼
┌─────────────────────────────────────┐
│  Claude Code CLI                     │  ← Nhận plan, thực thi code
│  API: Qwen coding plan              │     theo đúng spec từ CTO
│  File hướng dẫn: CLAUDE.md (này)    │
└──────────────┬──────────────────────┘
               │ Delegated tasks
               ▼
┌─────────────────────────────────────┐
│  OpenClaw Workers (Terminal)         │  ← Sub-tasks: file ops, testing,
│  Chạy dưới terminal                 │     formatting, repetitive work
└─────────────────────────────────────┘
```

### Quy tắc phối hợp

1. **CTO Agent quyết định WHAT** — Claude Code thực hiện HOW
2. **Khi nhận task từ CTO**, Claude Code phải:
   - Đọc file liên quan TRƯỚC khi code
   - Kiểm tra existing code để tránh duplicate
   - Follow naming conventions đã có trong project
   - KHÔNG refactor code ngoài phạm vi task
3. **Output của Claude Code phải:**
   - Chạy được ngay (no-build, mở trình duyệt là thấy)
   - Có comment giải thích logic phức tạp (tiếng Việt OK)
   - Commit message rõ ràng (xem mục 6)

### Khi CTO gửi coding plan

```
CTO Plan format thường là:
─────────────────────────
Task: [Mô tả task]
Files to modify: [Danh sách file]
Acceptance criteria: [Điều kiện hoàn thành]
Priority: [P0/P1/P2]
─────────────────────────

Claude Code xử lý:
1. Đọc files liên quan
2. Kiểm tra conflicts với code hiện tại
3. Implement theo plan
4. Self-test (mở browser nếu có thể)
5. Báo cáo kết quả
```

---

## 5. Bảo mật — KHÔNG ĐƯỢC VI PHẠM

### 5.1 Credentials & Secrets

```
⛔ TUYỆT ĐỐI KHÔNG:
- Hardcode API keys, passwords, tokens trong source code
- Commit file .env, mekong-env.js có credentials thật
- Hiển thị demo credentials trên production
- Log sensitive data ra console trong production

✅ PHẢI:
- Sử dụng environment variables
- Supabase anon key + RLS (key bị lộ vẫn an toàn nếu RLS đúng)
- Rate limiting trên Edge Functions
- Input sanitization mọi nơi nhận user input
```

### 5.2 XSS Prevention

```javascript
// ✅ ĐÚNG — Sanitize trước khi render
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

element.innerHTML = `<p>${escapeHtml(userInput)}</p>`;

// ❌ SAI — Render trực tiếp
element.innerHTML = `<p>${userInput}</p>`;
```

### 5.3 Auth Checks

```javascript
// ✅ MỌI trang admin/portal PHẢI có ở đầu file:
import { requireAuth, requireRole } from '/assets/js/auth.js';
await requireAuth();
await requireRole(['super_admin', 'manager']); // Theo role cần thiết
```

---

## 6. Git Conventions

### Commit Messages

```
Format: <type>(<scope>): <mô tả ngắn>

Types:
  feat     — Tính năng mới
  fix      — Sửa bug
  refactor — Refactor code (không thay đổi behavior)
  style    — CSS, formatting (không thay đổi logic)
  docs     — Documentation
  perf     — Performance improvement
  test     — Thêm/sửa tests
  chore    — Build, CI, dependencies

Scope (optional):
  admin, portal, affiliate, auth, landing, db, edge-fn, worker

Ví dụ:
  feat(admin): add kanban drag-drop for lead pipeline
  fix(auth): resolve redirect loop on expired session
  perf(landing): lazy-load service icons as WebP
  docs: move release notes to docs/releases/
```

### Branch Strategy

```
main              ← Production (auto-deploy to Cloudflare Pages)
feat/xxx          ← Feature branches
fix/xxx           ← Bug fixes
refactor/xxx      ← Refactoring tasks
```

**KHÔNG push trực tiếp vào `main`** cho thay đổi lớn. Tạo branch → PR → review.

---

## 7. Performance Guidelines

### Target Metrics (Lighthouse)

```
Performance:  > 90
Accessibility: > 95
Best Practices: > 90
SEO:           > 90
```

### Quy tắc Performance

```html
<!-- ✅ Preload critical resources -->
<link rel="preload" href="/assets/css/m3-agency.css" as="style">
<link rel="preload" href="/assets/js/auth.js" as="script" crossorigin>

<!-- ✅ Lazy load images -->
<img src="hero.webp" alt="..." loading="eager">  <!-- Hero only -->
<img src="service.webp" alt="..." loading="lazy"> <!-- Below fold -->

<!-- ✅ Async non-critical scripts -->
<script type="module" src="/assets/js/analytics.js" async></script>
```

- **Images**: WebP format, `srcset` cho responsive, `loading="lazy"`
- **CSS**: Critical CSS inline trong `<head>`, non-critical deferred
- **JS**: ES Modules với `type="module"` (tự động deferred)
- **Fonts**: `font-display: swap`, preload primary font
- **Caching**: Sử dụng `_headers` file cho Cloudflare cache rules

---

## 8. Testing

### Chạy Tests

```bash
# Unit tests (khi có)
npx vitest run

# HTML validation
npx html-validate "**/*.html"

# Kiểm tra links
npx linkinator https://sadec-marketing-hub.pages.dev

# Lighthouse CLI
npx lighthouse https://sadec-marketing-hub.pages.dev --output json
```

### Test Checklist trước khi commit

```
□ Trang mở được trên browser (không console errors)
□ Responsive: Mobile (375px), Tablet (768px), Desktop (1440px)
□ Auth flow hoạt động (login → redirect đúng role)
□ Supabase queries có RLS policy tương ứng
□ Không hardcode credentials
□ Không tạo file .md ở root
□ Commit message đúng format
```

---

## 9. Danh sách vấn đề ưu tiên (Updated: 2026-03-15)

### P0 — Khẩn cấp (Fix NGAY)

- [ ] **Xóa demo credentials** khỏi README.md và login page production
- [ ] **Xóa `.coverage`** khỏi repo, thêm vào .gitignore
- [ ] **Kiểm tra RLS policies** — đảm bảo anon key không leak data

### P1 — Quan trọng (Sprint này)

- [ ] **Dọn root directory** — di chuyển 40+ file .md vào `docs/` subfolders
- [ ] **Thống nhất naming** — chọn kebab-case cho files, PascalCase cho components
- [ ] **Setup ESLint + Prettier** — enforce code style
- [ ] **Resolve TS/JS conflict** — frontend = JS only, edge functions = TS only

### P2 — Cải thiện (Sprint sau)

- [ ] Images → WebP + lazy loading
- [ ] Structured data (JSON-LD) cho landing page
- [ ] Form validation + honeypot anti-spam
- [ ] Web Vitals monitoring (Cloudflare Analytics)
- [ ] CI/CD pipeline: lint → test → deploy

---

## 10. Lệnh thường dùng

```bash
# Chạy local server
npx serve . -p 3000

# Deploy (auto qua Cloudflare Pages khi push main)
git push origin main

# Supabase local
supabase start
supabase db push        # Apply migrations
supabase functions serve # Local edge functions

# Kiểm tra project
npx html-validate "**/*.html"
node --check assets/js/*.js
```

---

## 11. Liên hệ & Context

- **Project Owner**: huuthongdongthap
- **Region**: Sa Đéc, Đồng Tháp — target audience là SME vùng ĐBSCL
- **Ngôn ngữ UI**: Tiếng Việt (code comments có thể song ngữ)
- **Design System**: Material Design 3 Expressive, theme "Mekong Aurora"
- **Powered by**: OpenClaw & AI Agents

---

> **Nhắc nhở cuối**: File này thay thế mọi instruction cũ. Khi có conflict giữa
> CLAUDE.md và các file khác (ARCHITECTURE.md, CONTRIBUTING.md, etc.), CLAUDE.md
> luôn đúng. Cập nhật file này khi có thay đổi kiến trúc quan trọng.
