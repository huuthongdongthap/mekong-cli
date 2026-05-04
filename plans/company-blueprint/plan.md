# BookScout — Company Execution Blueprint

> **AI Book Discovery Engine** — Visual multi-source search, trust-scored rankings, web dashboard output.
> Stage: **Zero → PSF** | Model: **SaaS B2C + Freemium + Affiliate**

---

## 🏗 Architecture Overview

```
┌──────────────────────────────────────────────┐
│              USER (Web Dashboard)             │
│  Search → Visual Crawl Animation → Results    │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│           BookScout API (FastAPI)             │
│  /search → CrawlOrchestrator → RankEngine    │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│         Parallel Crawl Agents                │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐       │
│  │Goodreads│ │  NYT    │ │  Kirkus  │ ...   │
│  │ Reviews │ │Bestsell.│ │ Reviews  │       │
│  └─────────┘ └─────────┘ └──────────┘       │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│     Trust Score Engine + AI Summarizer        │
│  Weighted aggregation → Ranked output         │
└──────────────────────────────────────────────┘
```

---

## Department Execution Map

| Layer | Key Actions | Agent/Owner | Timeline |
|-------|-------------|-------------|----------|
| **Founder** | Vision, fundraising, community strategy, BookTok partnerships | CEO | Ongoing |
| **Product** | MVP search UX, visual crawl animation, trust score UI | Product/CTO | Month 1-2 |
| **Engineering** | Crawl engine (5 sources), API, web dashboard, real-time WebSocket | CTO/Dev | Month 1-3 |
| **Business** | Affiliate setup (Amazon, Bookshop.org), Pro tier pricing, B2B API pricing | Revenue Lead | Month 2-4 |
| **Marketing** | SEO (book recommendation keywords), Reddit/BookTok launch, content calendar | Growth Lead | Month 2-6 |
| **Ops** | Monitoring (crawl health, uptime), rate-limit compliance, GDPR setup | DevOps/CTO | Month 1-2 |

---

## Phase 1: MVP Build (Month 1-2)

### Core Product — Visual Book Search Engine

**What makes BookScout unique:**
1. **Visual Crawl Progress** — Users see real-time animated search across 5+ sources
2. **Trust Score™** — Weighted aggregation: critic reviews (40%) + user ratings (35%) + awards (15%) + recency (10%)
3. **Source Transparency** — Every rating shown with its source, not hidden behind an algorithm

### Technical MVP Scope

| Component | Technology | Priority |
|-----------|-----------|----------|
| Web Dashboard | Next.js + Framer Motion | P0 |
| Search API | FastAPI + Celery | P0 |
| Crawl Engine | Playwright + BeautifulSoup | P0 |
| Visual WebSocket | FastAPI WebSocket + SSE | P0 |
| Database | PostgreSQL + Redis cache | P0 |
| AI Summarizer | Gemini API | P1 |
| Chrome Extension | Manifest V3 | P2 |

### Source Integration Priority

| Source | Data Available | API? | Priority |
|--------|---------------|------|----------|
| Goodreads | Ratings, reviews, shelves | Unofficial | P0 |
| NYT Books | Bestseller lists, reviews | Official API | P0 |
| Kirkus Reviews | Professional reviews | Scrape | P0 |
| LibraryThing | Community ratings | API | P1 |
| BookRiot | Curated lists | Scrape | P1 |
| Tiki.vn | VN market ratings | Scrape | P2 |
| Fahasa | VN market availability | Scrape | P2 |

---

## Phase 2: Growth (Month 3-6)

### Revenue Activation
- Launch **Pro tier** ($9.99/mo): unlimited searches, API access, export to CSV/Notion
- Activate **affiliate links**: Amazon Associates (4-8%), Bookshop.org (10%)
- **B2B API** beta: libraries, EdTech platforms

### Marketing Engine
- **SEO**: Target 500+ long-tail keywords ("best books 2026", "top rated mystery novels")
- **BookTok Campaign**: 20 influencer partnerships, 30-day free Pro trials
- **Reddit Organic**: Weekly curated lists on r/books, r/booksuggestions, r/suggestmeabook
- **Email Digest**: Weekly "Top Rated New Releases" powered by crawl data

### Metrics Targets (Month 6)
| Metric | Target |
|--------|--------|
| MAU | 10,000 |
| MRR | $5,000 |
| Free→Pro Conversion | 5% |
| Weekly Active Searches | 25,000 |
| Sources Integrated | 10 |

---

## Phase 3: Scale (Month 7-12)

- **International**: Vietnam (Tiki, Fahasa), SEA markets
- **Publisher Partnerships**: Premium placement, early access to ARCs
- **API Marketplace**: Self-serve B2B API with usage-based pricing
- **Chrome Extension**: Instant ratings overlay on any book page
- **Mobile App**: React Native, push notifications for new releases

### Target: $80K MRR by Month 12

---

## Governance & Compliance

| Area | Status | Action |
|------|--------|--------|
| GDPR/PDPA | Planned | No personal reading data stored/sold |
| Terms of Service | Draft | Fair use crawling, attribution policy |
| Rate Limiting | Built-in | Respect robots.txt, max 1 req/sec/source |
| Copyright | Compliant | Metadata only, no full review reproduction |
| Financial Audit | Q4 | QuickBooks setup, P&L tracking |

---

## Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Source blocks crawling | High | High | API partnerships, proxy rotation, caching |
| Copyright claims | Medium | High | Metadata-only policy, legal review |
| Low paid conversion | Medium | Medium | Enhanced Pro features, A/B test pricing |
| Competitor enters | Low | Medium | Speed advantage, trust brand, community |
| AI summarization quality | Medium | Low | Human review layer, user feedback loop |

---

## Follow-up Execution Chain

```
PHASE 1: INTELLIGENCE ✅ (This document)
  → SWOT analysis completed
  → 5-factor assessment done
  → Technical stack defined

PHASE 2: STRATEGY → Next conversation
  → Implementation plan for MVP
  → Visual search UX design
  → GTM strategy finalization

PHASE 3: BUILD → /build command
  → Build MVP crawler + dashboard end-to-end
  → Full test suite
  → Deploy to Cloudflare

PHASE 4: REVENUE → /money command
  → Launch affiliate tracking
  → Sales pipeline for B2B API
  → Pricing experiments

PHASE 5: SCALE → /studio command
  → International expansion
  → Publisher partnerships
  → Series A preparation
```
