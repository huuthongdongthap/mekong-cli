# PTP Tech — Hướng Dẫn Sử Dụng Mekong CLI

> **Dự án**: PTP Tech — Solar & Smart Home  
> **Location**: Sa Đéc, Đồng Tháp  
> **Stack**: Next.js + Cloudflare Workers + D1 + payOS  
> **Status**: Bootstrapping  
> **Mục tiêu**: Custom website thay thế KiotViet, doanh thu 500tr/tháng

---

## Mục Lục

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Cấu Trúc Thư Mục](#2-cấu-trúc-thư-mục)
3. [5 Bước Sử Dụng Mekong CLI](#3-5-bước-sử-dụng-mekong-cli)
4. [10 Commands Quan Trọng Nhất](#4-10-commands-quan-trọng-nhất)
5. [Quy Trình Làm Việc Hàng Ngày](#5-quy-trình-làm-việc-hàng-ngày)
6. [Commands Theo Layer](#6-commands-theo-layer)
7. [Binh Pháp Chain](#7-binh-pháp-chain)
8. [Model Routing](#8-model-routing)
9. [Quick Reference](#9-quick-reference)

---

## 1. Tổng Quan Dự Án

### Thông Tin Công Ty

| Field | Value |
|-------|-------|
| **Tên** | CÔNG TY TNHH CÔNG NGHỆ DỊCH VỤ PTP |
| **Short Name** | PTP Tech |
| **Founded** | 2024 |
| **Location** | Sa Đéc, Đồng Tháp |
| **Phone** | 093 280 9179 |
| **Email** | ptptech.vn@gmail.com |
| **Facebook** | fb.com/ptptechsolar |
| **Website** | ptptech.vn |

### Mô Hình Kinh Doanh

- **Type**: E-commerce + Services
- **Current Platform**: KiotViet (kiotvietweb.vn)
- **Goal**: Build custom website — independent platform, better UX, lower fees

### Revenue Streams

1. Solar equipment sales (B2C + B2B)
2. Smart home products (Hunonic)
3. Installation services
4. Maintenance & warranty
5. Consulting & system design

### Product Categories

| Category | Products | Price Range |
|----------|----------|-------------|
| Đèn NLMT | Kungfu Solar, đèn pha, đèn đường | 580K - 1.2tr |
| Điện NLMT | Tấm pin, inverter, pin lưu trữ | 25K - 162tr |
| Smart Home | Hunonic — công tắc, cảm biến, khóa | 195K - 1.7tr |
| Phụ Kiện | MC4, rail nhôm, tủ điện | 5K - 441K |

### Target Metrics

| Metric | Target |
|--------|--------|
| Monthly Revenue | 500tr |
| Avg Order Value | 5tr |
| Orders/Month | 100 |
| Installation Projects/Month | 10 |

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js + Cloudflare Pages |
| Backend | Cloudflare Workers (Hono.js) |
| Database | D1 (SQLite) + KV |
| Payment | payOS (Vietnam gateway) |
| Deployment | Cloudflare (zero cost) |

---

## 2. Cấu Trúc Thư Mục

```
PTP Tech/
├── ptp-tech/                    # Code chính
│   ├── frontend/                # Next.js → Cloudflare Pages
│   │   ├── src/app/             # App router pages
│   │   ├── public/              # Static assets
│   │   ├── data/                # Data files
│   │   ├── next.config.js
│   │   ├── wrangler.toml
│   │   └── package.json
│   ├── api/                     # Cloudflare Workers
│   │   ├── src/index.ts         # Worker entry point
│   │   ├── schema.sql           # D1 schema
│   │   ├── wrangler.toml
│   │   └── package.json
│   ├── plans/                   # Implementation plans
│   │   ├── 260520-0001-phase1-trust-conversion
│   │   └── 260520-0004-phase4-deployment
│   ├── reports/                 # Cook reports
│   │   └── core/cook/
│   ├── README.md
│   └── package.json             # Root scripts
├── studio/                      # Venture studio
│   ├── company.json             # Company config
│   ├── DASHBOARD.md
│   ├── strategy/                # Business strategy
│   │   ├── venture-thesis.md
│   │   ├── business-model.md
│   │   └── roadmap.json
│   ├── portfolio/               # Portfolio tracking
│   │   └── portfolio.json
│   ├── dealflow/                # Deal pipeline
│   │   └── pipeline.json
│   └── expert-network/          # Expert network
│       └── experts.json
└── reports/                     # Business reports
    ├── cook/                    # Phase reports
    │   ├── phase1-mvp.md
    │   └── phase2-solar-platform.md
    ├── finance/                 # Budget & forecast
    │   └── budget/
    └── hr/                      # Recruitment & performance
        ├── recruit/
        └── performance/
```

---

## 3. 5 Bước Sử Dụng Mekong CLI

### Auto Dispatch Cho PTP Tech

Guide này đã có dispatcher tự động tại:

```bash
cd "/Users/mac/mekong-cli/PTP Tech"

# Kiểm tra toàn bộ 5 bước, không chạy tác vụ nặng
scripts/ptp-mekong-auto.sh --check all

# Chạy thật một bước cụ thể
scripts/ptp-mekong-auto.sh --execute step4-business

# Daily workflow
scripts/ptp-mekong-auto.sh --execute daily

# Kiểm tra 10 command quan trọng nhất
scripts/ptp-mekong-auto.sh --check top10

# Auto dispatch 10 command quan trọng nhất
scripts/ptp-mekong-auto.sh --auto top10
```

Dispatcher dùng `.mekong/dispatch/ptp-auto-dispatch.json` để map các command trong guide sang registry hiện tại của Mekong CLI. Mặc định dùng `--check` để resolve command qua `mekong codex-command ... --invocation --check`; chỉ dùng `--execute` khi muốn chạy thật.

### Bước 1: KHỞI ĐỘNG & CONTEXT

```bash
# Di chuyển vào thư mục dự án
cd ~/mekong-cli/"PTP Tech/ptp-tech"

# Kiểm tra health hệ thống
mekong status
mekong health

# Load context dự án
mekong context:prime
```

### Bước 2: CHIẾN LƯỢC (Founder Layer)

```bash
# Phân tích SWOT
mekong swot

# Thiết lập OKR
mekong ok

# Phân tích 5 yếu tố Binh Pháp
mekong venture:five-factors

# Phân tích địa hình thị trường
mekong venture:terrain

# Tính điểm momentum
mekong venture:momentum

# Phân tích hư-thực (đối thủ)
mekong venture:void-substance
```

### Bước 3: XÂY DỰNG SẢN PHẨM (Engineering Layer)

```bash
# Build feature mới (PEV Pipeline: Plan→Execute→Verify)
mekong cook "Thêm trang sản phẩm đèn năng lượng mặt trời"

# Fix bug
mekong fix "Lỗi thanh toán payOS không callback"

# Tạo implementation plan
mekong plan/hard "Xây dựng hệ thống giỏ hàng + thanh toán"

# Code review
mekong review

# Deploy
mekong deploy

# Ship complete (test→commit→push→deploy)
mekong ship
```

### Bước 4: KINH DOANH (Business Layer)

```bash
# Marketing campaign
mekong marketing-campaign-run

# Content engine
mekong marketing-content-engine

# Sales pipeline
mekong sales-pipeline-build

# Deal close
mekong sales-deal-close

# Tài chính & ngân sách
mekong finance-budget-plan
mekong finance-monthly-close

# SEO audit
mekong ck-marketing-seo

# Viết blog
mekong writer-blog

# Newsletter
mekong writer-newsletter
```

### Bước 5: VẬN HÀNH (Ops Layer)

```bash
# Health sweep toàn hệ thống
mekong ops-health-sweep

# Báo cáo hàng ngày
mekong daily

# Security audit
mekong ops-security-audit

# CTO dashboard
mekong cto-dashboard

# Sync tất cả
mekong sync-all

# Production status
mekong production-status
```

---

## 4. 10 Commands Quan Trọng Nhất

| # | Command | Mục Đích | Thời Gian | MCU |
|---|---------|----------|-----------|-----|
| 1 | `mekong cook "goal"` | Build feature hoàn chỉnh | ~20 min | 3 |
| 2 | `mekong deploy` | Deploy lên Cloudflare | ~10 min | 5 |
| 3 | `mekong ship` | Test→commit→push→deploy | ~15 min | 3 |
| 4 | `mekong fix "error"` | Debug & sửa lỗi | ~10 min | 3 |
| 5 | `mekong plan/hard "task"` | Tạo implementation plan | ~10 min | 3 |
| 6 | `mekong daily` | Báo cáo hàng ngày | ~5 min | 3 |
| 7 | `mekong marketing-campaign-run` | Chạy campaign | ~25 min | 3 |
| 8 | `mekong ops-health-sweep` | Kiểm tra sức khỏe hệ thống | ~15 min | 3 |
| 9 | `mekong finance-budget-plan` | Lập ngân sách | ~20 min | 3 |
| 10 | `mekong review` | Code review | ~5 min | 3 |

---

## 5. Quy Trình Làm Việc Hàng Ngày

### Buổi Sáng (5-10 phút)

```bash
mekong daily              # Báo cáo tình hình
mekong ops-health-sweep   # Kiểm tra hệ thống
mekong cto-dashboard      # CTO health check
```

### Trong Ngày (theo task)

```bash
# Build features
mekong cook "Thêm tính năng X"

# Sửa lỗi
mekong fix "Bug Y"

# Planning
mekong plan/hard "Task Z"

# Code review
mekong review
```

### Cuối Ngày (5-10 phút)

```bash
# Deploy nếu có changes
mekong ship

# Báo cáo cuối ngày
mekong daily

# Git commit
mekong git/commit
```

### Weekly Sprint

```bash
# Weekly studio sprint
mekong studio:sprint:weekly

# Portfolio status
mekong portfolio-status

# General report
mekong general-report
```

---

## 6. Commands Theo Layer

### 👑 Founder Layer (Chiến Lược)

| Command | Mục Đích |
|---------|----------|
| `mekong swot` | Phân tích SWOT |
| `mekong ok` | Thiết lập OKR |
| `mekong venture:five-factors` | Đánh giá 5 yếu tố |
| `mekong venture:terrain` | Phân tích thị trường |
| `mekong venture:momentum` | Tính momentum |
| `mekong fundraise` | Chiến lược gọi vốn |
| `mekong financial-model` | Xây dựng mô hình tài chính |
| `mekong forecast` | Dự báo doanh thu |

### 💼 Business Layer (Kinh Doanh)

| Command | Mục Đích |
|---------|----------|
| `mekong marketing-campaign-run` | Chạy campaign |
| `mekong marketing-content-engine` | Content engine |
| `mekong sales-pipeline-build` | Xây sales pipeline |
| `mekong sales-deal-close` | Chốt deal |
| `mekong finance-budget-plan` | Lập ngân sách |
| `mekong finance-monthly-close` | Close sổ tháng |
| `mekong accounting-daily` | Kế toán hàng ngày |
| `mekong pricing` | Chiến lược giá |
| `mekong competitor` | Phân tích đối thủ |
| `mekong ck-marketing-seo` | SEO |
| `mekong writer-blog` | Viết blog |
| `mekong writer-newsletter` | Newsletter |

### 📦 Product Layer (Sản Phẩm)

| Command | Mục Đích |
|---------|----------|
| `mekong plan` | Implementation plan |
| `mekong plan/hard` | Plan sâu có research |
| `mekong design-sprint` | Design sprint |
| `mekong product-discovery` | Product discovery |
| `mekong roadmap` | Product roadmap |
| `mekong brainstorm` | Brainstorming |
| `mekong feedback` | Thu thập feedback |

### ⚙️ Engineering Layer (Kỹ Thuật)

| Command | Mục Đích |
|---------|----------|
| `mekong cook` | PEV Pipeline (Plan→Execute→Verify) |
| `mekong fix` | Debug & sửa lỗi |
| `mekong code` | Viết code |
| `mekong test` | Chạy tests |
| `mekong deploy` | Deploy |
| `mekong ship` | Ship production |
| `mekong review` | Code review |
| `mekong refactor` | Refactor code |
| `mekong git/commit` | Auto commit |
| `mekong git/create-pr` | Tạo PR |

### 🔧 Ops Layer (Vận Hành)

| Command | Mục Đích |
|---------|----------|
| `mekong daily` | Báo cáo hàng ngày |
| `mekong status` | Trạng thái hệ thống |
| `mekong ops-health-sweep` | Health audit |
| `mekong cto-dashboard` | CTO dashboard |
| `mekong ops-security-audit` | Security audit |
| `mekong sync-all` | Sync everything |
| `mekong production-status` | Production board |

---

## 7. Binh Pháp Chain

### 5 Phase Thực Thi

```
PHASE 1: INTELLIGENCE → mekong swot, mekong venture:five-factors
PHASE 2: STRATEGY     → mekong plan, mekong venture:terrain
PHASE 3: BUILD        → mekong cook, mekong test, mekong deploy
PHASE 4: REVENUE      → mekong marketing, mekong sales, mekong pricing
PHASE 5: SCALE        → mekong competitor, mekong finance:forecast
```

### 6 Chương Binh Pháp

| Chương | Hán Tự | Layer | Ý Nghĩa |
|--------|--------|-------|----------|
| Initial Calculations | 始計 | Founder | Chiến lược, tầm nhìn |
| Waging War | 作戰 | Business | Vận hành kinh doanh |
| Attack by Stratagem | 謀攻 | Product | Sản phẩm thông minh |
| Military Contention | 軍爭 | Engineering | Build & ship |
| Nine Variations | 九變 | Ops | Linh hoạt vận hành |
| Art of War (Complete) | 孫子兵法 | Studio | Toàn bộ chiến thuật |

---

## 8. Model Routing

### Agent & Model Cho PTP Tech

| Task Type | Agent | Model | Lý Do |
|-----------|-------|-------|-------|
| Quick fix | mekong-fast | deepseek-v4-flash | Nhanh nhất |
| Code feature | mekong-worker | qwen3-coder-next (local) | Coding SOTA |
| Architecture | mekong-cto | glm-5.1 | Strategic thinking |
| Planning | plan | deepseek-v4-pro | Deep reasoning |
| Marketing | mekong-creative | minimax-m2.7 | Creative strength |
| Data/Finance | mekong-analyst | kimi-k2.6 | Analytical |
| Default | build | qwen3.6-plus | Balanced |

### CLI Usage

```bash
# Default
opencode

# Fast local
opencode --agent mekong-fast

# Code worker
opencode --agent mekong-worker

# CTO advisor
opencode --agent mekong-cto

# Creative tasks
opencode --agent mekong-creative

# Data analysis
opencode --agent mekong-analyst
```

---

## 9. Quick Reference

### Use Case → Command

| Tôi muốn... | Command |
|-------------|---------|
| Build feature mới | `mekong cook "mô tả"` |
| Fix bug | `mekong fix "mô tả bug"` |
| Deploy production | `mekong ship` |
| Xem status hàng ngày | `mekong daily` |
| Marketing campaign | `mekong marketing-campaign-run` |
| SEO audit | `mekong ck-marketing-seo` |
| Viết blog | `mekong writer-blog` |
| Lập ngân sách | `mekong finance-budget-plan` |
| Code review | `mekong review` |
| Security audit | `mekong ops-security-audit` |
| Commit code | `mekong git/commit` |
| Tạo PR | `mekong git/create-pr` |

### CLI Flags

| Flag | Viết tắt | Mô tả |
|------|----------|-------|
| `--verbose` | `-v` | Hiển thị chi tiết |
| `--dry-run` | `-n` | Chỉ plan, không execute |
| `--strict` | — | Dừng khi gặp lỗi |
| `--json` | `-j` | Output JSON |

---

## Phụ Lục: Venture Thesis Tóm Tắt

### Market Opportunity

- **Vấn đề**: Chi phí điện tăng 15-20%/năm, áp lực ESG, grid instability
- **Cơ hội**: 500K+ manufacturing facilities tại VN cần chuyển đổi solar
- **TAM**: $2B+ | **SAM**: $500M | **SOM**: $50M (5 years)

### Growth Phases

| Phase | Timeline | Target | MRR |
|-------|----------|--------|-----|
| Phase 1: MVP | Months 1-3 | 3 pilot customers | $5K |
| Phase 2: PMF | Months 4-6 | 10 paying customers | $25K |
| Phase 3: Scale | Months 7-12 | 30+ customers | $75K |
| Phase 4: Leadership | Year 2 | 100+ customers | $250K |

### Unit Economics

| Metric | Value |
|--------|-------|
| Avg Contract Value | $60K/year |
| Gross Margin | 75% |
| CAC | $3K |
| LTV | $180K (3 years) |
| LTV:CAC | 60:1 |
| Payback | 2-3 months |

---

> **Tài liệu này được tạo cho PTP Tech — Mekong CLI v6.0**  
> **Cập nhật**: 2026-05-22  
> **© 2026 Mekong Agency · MIT License**
