# LinkEduVN Backend — 5-Layer Implementation Plan

## Overview

Build the LinkEduVN B2B2C training ecosystem backend across 5 sequential layers. Each layer depends on prior layers. Tech lock: Node.js / NestJS 10, Next.js 14, PostgreSQL 16, Redis 7, Prisma 5, Zod, Vercel (FE), Railway (BE), R2 (files), Resend (email), OpenAI (chatbot), Sentry (monitoring). Budget: $80K tech allocation from Pre-Seed.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  L5  DevOps    CI/CD · Railway · Vercel · Sentry · Uptime   │
├─────────────────────────────────────────────────────────────┤
│  L4  Integrations  Email · Files · Payments · AI · BullMQ  │
├─────────────────────────────────────────────────────────────┤
│  L3  Business Layer  CTĐT Lifecycle · Enrollment FSM       │
├─────────────────────────────────────────────────────────────┤
│  L2  API (NestJS)  80+ endpoints · RBAC 6 roles · RFC7807  │
├─────────────────────────────────────────────────────────────┤
│  L1  Data        PG16 · Prisma 5 · Redis 7 · 17 tables     │
└─────────────────────────────────────────────────────────────┘
```

## Layer Summary

| Layer | Name | Cmd | Responsible | Status |
|-------|------|-----|-------------|--------|
| L1 | Data | — | coder | ✅ DONE |
| L2 | API | /dev-feature | coder | 🔄 70% |
| L3 | Business | /dev-feature | coder | ⏳ Pending |
| L4 | Integrations | /dev-feature | coder | ⏳ Pending |
| L5 | DevOps | /deploy | devops | ⏳ Pending |

## Layer 1: Data (L1) — COMPLETE

**Files:** `prisma/schema.prisma`, `prisma/seed.ts`, `docker-compose.yml`, `src/main.ts`, `src/app.module.ts`, `packages/shared/`

**Model:** 17 Prisma tables (Province, District, User, School, SchoolContact, Enterprise, EnterpriseContact, MOA, Program, Learner, Enrollment, PracticeRecord, Evaluation, Placement, Invoice, AuditLog, Document) + 30 enums.

**Decisions locked:**
- Soft-delete: Prisma middleware auto-filter `deletedAt IS NULL`
- VND money: `Int` (BIGINT), no decimals
- CCCD: Base64 at app layer (AES-256-GCM later)
- Multi-tenant: Application-level, not PG RLS
- State machines: Hard-coded (not DB) for legal compliance

## Layer 2: API (L2) — 70% DONE

**Cmd:** `/dev-feature --auth --rbac`

**Status:**
- ✅ All 12 NestJS modules scaffolded (controller + service + module)
- ✅ Auth module (JWT + Google + Microsoft strategies)
- ✅ RBAC decorators (`@Roles`), TenantGuard, exception filters
- ✅ RFC 7807 Vi/En bilingual error format
- ✅ DTO validation via Zod schemas in `packages/shared/`
- 🔄 Missing: DTO class files per endpoint, integration tests, OpenAPI annotations

## Layer 3: Business Layer (L3) — PENDING

**Cmd:** `/dev-feature --business-logic`

**Domain:**
1. **CTĐT Lifecycle**: Draft → Pending Approval → Active → Suspended → Closed
2. **Enrollment FSM**: Pre-enrolled → Active → Graduated → Dropped → Transferred
3. **Placement Tracking**: In Progress → Completed → Terminated
4. **MOU State Machine**: Draft → Pending School → Pending Enterprise → Active → Expired → Terminated
5. **Invoice Flow**: Pending → Paid / Cancelled

**Stats Service** (Dashboard):
- School overview: learners, programs, enrollments, placement rate
- Enterprise overview: MOUs, placements, avg salary
- System overview: aggregate KPIs

## Layer 4: Integrations (L4) — PENDING

**Cmd:** `/dev-feature --integrations`

| Service | Provider | Purpose |
|---------|----------|---------|
| Email | Resend | Registration, password reset, notifications |
| Files | Cloudflare R2 | CCCD scans, contracts, certificates |
| Payments | MoMo / VNPay | Tuition, service fees (VND) |
| AI Chatbot | OpenAI (gpt-4o-mini) | Career counseling, FAQ |
| Jobs | BullMQ + Redis | Email queue, PDF generation, batch ops |

## Layer 5: DevOps (L5) — PENDING

**Cmd:** `/deploy`

**CI/CD (4 GitHub Actions workflows):**
1. `ci.yml` — lint + typecheck + test + build on PR
2. `deploy-staging.yml` — auto-deploy to Railway staging on merge to `dev`
3. `deploy-production.yml` — manual trigger, deploy to Railway prod + Vercel
4. `security-scan.yml` — Snyk + Trivy on schedule

**Monitoring:**
- Sentry (error tracking)
- Railway metrics (CPU, memory, response time)
- UptimeRobot 60s health check on `/api/v1/health`
- Daily `pg_dump` → R2 backup

## Command Reference

| Layer | Primary | Secondary | Scope |
|-------|---------|-----------|-------|
| L1 | `/dev-feature --database` | — | Schema, seed, Docker |
| L2 | `/dev-feature --api` | `/test` | Endpoints, tests |
| L3 | `/dev-feature --business` | `/dev-feature --api` | Services, FSM |
| L4 | `/dev-feature --integrations` | `ci:run-ci` | Providers, queues |
| L5 | `/deploy` | `/ship` | CI/CD, Railway |

## Success Criteria

- [ ] All 80+ API endpoints return 200 with correct envelope
- [ ] All 6 roles can only access their scoped resources
- [ ] CTĐT state machine transitions enforced
- [ ] Email/R2/Payments/OpenAI integrations respond in < 3s
- [ ] Railway deploys green on `git push` to `dev`/`main`
- [ ] Sentry captures unhandled errors
- [ ] Health check returns 200 from UptimeRobot
- [ ] Daily DB backup lands in R2
