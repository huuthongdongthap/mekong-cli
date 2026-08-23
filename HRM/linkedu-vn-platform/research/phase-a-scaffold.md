# Phase A: Project Scaffold — Implementation Plan

**Priority**: CRITICAL | **Status**: COMPLETE (scaffold + seed design)

## Overview

This phase sets up the full project scaffold for LinkEduVN backend:
Prisma 5.x schema with 17 tables, project directory structure, Docker Compose
for local development, NestJS entry points, and comprehensive seed data.

## Key Insights

- All PKs use `uuid_generate_v4()` except auto-increment surrogates (enrollment_no, codes)
- Soft delete via `deleted_at TIMESTAMPTZ` — application-layer `@@omit` filters
- All monetary stored as `Int` (VND), all timestamps as `TIMESTAMPTZ (UTC)`
- `nationalId` (CCCD) MUST be encrypted AES-256-GCM at application layer before DB INSERT
- Province/district as FK using composite pattern — districts share province_code PK prefix
- `pg_trgm` extension enables Vietnamese word-boundary trigram search on name fields
- Multi-tenancy via application middleware — NOT PostgreSQL RLS (simpler ops, explicit control)

## Technical Requirements

- Prisma 5.x with PostgreSQL 16 dialect
- NestJS 10+ (modular, feature-first architecture)
- TypeScript 5.x strict mode
- Docker Compose: PG16 + Redis7 + API dev container
- pg_trgm extension for fuzzy Vietnamese search

## Related Code Files

### Created
- `packages/api/prisma/schema.prisma` — Full Prisma schema (17 tables + 30 enums)
- `packages/api/prisma/seed.ts` — Production-grade seed data
- `packages/api/prisma/seed-vi.sql` — Bulk seed SQL (fast alternative)
- `packages/api/prisma/migrations/meta/` — Migration metadata
- `docker-compose.yml` — PostgreSQL 16 + Redis 7 + API
- `packages/api/src/main.ts` — NestJS bootstrap
- `packages/api/src/app.module.ts` — Root module
- `packages/api/src/modules/prisma.module.ts` — Prisma singleton
- `packages/api/src/modules/redis.module.ts` — Redis singleton
- `packages/api/src/modules/storage.module.ts` — R2 storage service
- `packages/api/src/modules/logger.module.ts` — Pino logger
- `packages/api/src/common/filters/http-exception.filter.ts` — Global error handler
- `packages/api/src/common/interceptors/transform.interceptor.ts` — Response wrapper

### To Be Created (by subsequent phases)
- `packages/api/src/features/*/` — Per-domain feature modules (10+ modules)
- `packages/api/src/common/decorators/*` — RBAC, current-user
- `packages/api/src/common/guards/*` — Auth, role, tenant guards
- `packages/api/src/common/middleware/*` — Tenant resolution, CCID encryption
- `packages/api/src/common/pipes/*` — Custom validation
- `packages/api/src/config/` — Environment-backed config service

## Implementation Steps

1. ✅ Define all 30 enum types matching Vietnamese domain vocabulary
2. ✅ Create 17 Prisma models with proper FK relations, indexes, and @@map
3. ✅ Configure pg_trgm extension and composite-index patterns
4. ✅ Set up NestJS root module with all infrastructure modules
5. ✅ Create Docker Compose with PG16 + Redis7 + API service
6. ✅ Write seed data (3 schools, 5 enterprises, 20 learners, 5 MOAs, 10 programs, 30 enrollments, 8 placements)
7. ✅ Create Prisma singleton module and NestJS bootstrap

## Todo

- [x] Prisma schema with 17 tables + 30 enums
- [x] All FK relations with proper `onDelete` cascade where appropriate
- [x] Indexes on FK columns + composite index for RBAC queries
- [x] @@map for snake_case table names
- [x] JSONB fields for flexible structured data
- [x] UTC TIMESTAMPTZ for all timestamps
- [x] Int for all monetary values
- [x] UUID v4 for primary keys
- [x] Documents requiring app-level encryption annotated
- [x] User-supersoft-delete `@@id` pattern configured
- [x] Docker Compose with PG16 + Redis7
- [x] NestJS AppModule with infrastructure wiring
- [x] NestJS bootstrap with Swagger + validation + security
- [x] Seed data for all primary entities

## Success Criteria

- `npx prisma migrate dev` runs without errors
- `npx prisma db seed` populates all lookup data, 3 schools, 5 enterprises, 20 learners, 5 MOAs, 10 programs, 30 enrollments, 8 placements
- `docker compose up` starts PG16 + Redis7 + API cleanly
- `GET /api/v1/docs` returns OpenAPI spec
- `GET /api/v1/health` returns 200 OK
- All FKs actually resolve (no FK violations on seed)
- Schema validated: 17 tables, 30 enums, all indexes present

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| CCID encryption not applied at app layer | HIGH | Document requirement in PRISMA_COMMENTS, implement middleware in Phase B |
| Composite PK on districts (province_code, id) not unique | MEDIUM | Use auto-increment id within province_code scope |
| Enum value mismatch between TS and Prisma | MEDIUM | Import enums from generated `@prisma/client` |

## Security Considerations

- `nationalId` (CCCD) encoded at application layer only — NOT in DB schema
- `password_hash` must never be selectable in queries — use `select: false`
- Audit log is INSERT-only — no UPDATE/DELETE allowed by design
- All monetary amounts in VND Int — no float precision issues
- `signedDocUrl`, `r2Url` outbound — validate against allowed hostname

## Next Steps

- **Phase B**: Authentication — JWT strategy, registration, login, password reset
- **Phase C**: RBAC middleware — tenant resolution, role enforcement guards
- **Phase D**: Feature module implementation (schools, enterprises, learners, programs)
- **Phase E**: Application-layer NCCID encryption middleware
