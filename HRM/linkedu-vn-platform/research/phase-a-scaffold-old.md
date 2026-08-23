# Phase A: Project Scaffold — Implementation Plan

**Priority**: CRITICAL | **Status**: COMPLETE (scaffold design)

## Overview

This phase sets up the full project scaffold for LinkEduVN backend:
Prisma 5.x schema with 17 tables, project directory structure, Docker Compose
for local development, NestJS entry points, and comprehensive seed data.

## Key Insights

- All PKs use `uuid_generate_v4()` except auto-increment surrogates (transaction code, enrollment_no)
- Soft delete via `deleted_at TIMESTAMPTZ` with application-layer query filtering
- CCCD national ID must be encrypted (AES-256-GCM) at the application layer before persist — NOT in DB schema
- Province/district FK uses composite pattern: districts have (province_code, id) as composite reference
- `utf8mb4` encoding is default in PostgreSQL via collation configuration in Docker Compose
- pg_trgm extension enables Vietnamese word-boundary trigram search on name fields
- All money amounts in VND Int — avoid float precision issues
- Multi-tenancy handled via application middleware, NOT PostgreSQL RLS (simpler ops)

## Technical Requirements

- Prisma 5.x with PostgreSQL 16 + pg_trgm extension
- NestJS 10+ (modular, feature-first architecture)
- TypeScript 5.x strict mode
- Docker Compose: PG16 + Redis7
- pg_trgm enabled for Vietnamese text search

## Schema Architecture

### Core Design Decisions
- UUID v4 for all primary keys using `uuid_generate_v4()` from `uuid-ossp` extension
- `@map` directives map camelCase model names to snake_case tables
- All timestamps use `TIMESTAMPTZ` for UTC storage
- Monetary fields use `Int` (VND integer, no decimals)
- Foreign keys named `{entity}Id` for consistency
- Dual FK on invoices: exactly one of school_id OR enterprise_id must be set
- Enrollments: program-exclusive per policy (approved array → separate EnrollmentEvent, REJECTED, etc.)
- Practice records: immutable after creation (no update endpoint)
- Audit logs: INSERT-only, no UPDATE/DELETE (enforced at application layer)

## Related Code Files

### to create
- `packages/api/prisma/schema.prisma` — Full Prisma schema (17 tables)
- `packages/api/prisma/seed.ts` — TypeScript seed file
- `docker-compose.yml` — PG16 + Redis7 + API
- `packages/api/src/main.ts` — NestJS bootstrap
- `packages/api/src/app.module.ts` — Root module
- `packages/api/src/modules/prisma.module.ts` — Prisma singleton
- `packages/api/src/modules/redis.module.ts` — Redis singleton
- `packages/api/src/modules/storage.module.ts` — R2 config
- `packages/api/src/modules/logger.module.ts` — Pino logger
- `packages/api/src/common/guards/roles.guard.ts` — Role-based access
- `packages/api/src/common/guards/jwt-auth.guard.ts` — JWT authentication
- `packages/api/src/common/decorators/current-user.decorator.ts` — Current user
- `packages/api/src/common/filters/http-exception.filter.ts` — Global exception filter
- `packages/api/src/common/interceptors/transform.interceptor.ts` — Response wrapper
- `packages/api/src/features/health/health-module.ts` — Health check

### will be created in later phases
- `packages/api/src/features/auth/auth.module.ts`
- `packages/api/src/features/auth/auth.service.ts`
- `packages/api/src/features/auth/login.dto.ts`
- `packages/api/src/features/auth/register.dto.ts`
- `packages/api/src/features/auth/jwt.strategy.ts`
- `packages/api/src/features/users/users.module.ts`
- `packages/api/src/features/users/users.service.ts`
- `packages/api/src/features/programs/programs.module.ts`
- `packages/api/src/features/programs/programs.service.ts`
- `packages/api/src/features/learners/learners.module.ts`
- `packages/api/src/features/enrollments/enrollments.module.ts`
- `packages/api/src/features/placements/placements.module.ts`
- `packages/api/src/features/moa/moa.module.ts`
- `packages/api/src/features/invoices/invoices.module.ts`
- [etc.]

## Implementation Steps

1. Define all enum types (20+ enums: UserRole, SchoolType, etc.)
2. Create models 1-15 per specification in dependency order (lookups first)
3. Configure pg_trgm extension in Prisma schema
4. Set up NestJS root module with all infrastructure modules
5. Create Docker Compose with PG16 + Redis7 + API service containers
6. Write comprehensive seed data with realistic Vietnamese names and data
7. Validate schema with `prisma migrate dev` and test seed

## Todo List

### Schema
- [x] Base enums: UserRole, SchoolType, SchoolStatus, EnterpriseIndustry, etc.
- [x] Province + District models (lookup tables)
- [x] User model (auth foundation, 17 FK relations)
- [x] School + SchoolContact models
- [x] Enterprise + EnterpriseContact models
- [x] Moa model (MOU with business rules)
- [x] Program model (CTĐT per decree)
- [x] Learner model (students with encrypted CCCD)
- [x] Enrollment model (junction with status machine)
- [x] PracticeRecord model (perp TT47/2021)
- [x] Evaluation model (rubric-based)
- [x] Placement model (job tracking)
- [x] Invoice model (financial with dual-FK)
- [x] AuditLog model (immutable)
- [x] Document model (R2-backed files)
- [x] @@id, @@unique, @@index on all models per spec

### Infrastructure
- [x] PrismaModule (singleton)
- [x] RedisModule (singleton)
- [x] StorageModule (R2 config)
- [x] LoggerModule (Pino)

### NestJS Bootstrap
- [x] main.ts with Swagger, CORS, validation, exception filter
- [x] AppModule with all feature modules wired
- [x] HealthModule for readiness/liveness checks

### Seed Data
- [x] 3 schools (TC-HCM, CD-HN, DH-DN)
- [x] 5 enterprises (IT, Logistics, Manufacturing, Healthcare, Semiconductor)
- [x] 20 learners with realistic Vietnamese names
- [x] 5 MOAs linking school-enterprise pairs
- [x] 10 CTĐT programs across fields
- [x] 30 enrollments
- [x] 8 placements with 3m/6m tracking
- [x] Districts per province

### Development Environment
- [x] Docker Compose with PG16 + Redis7
- [x] Health checks on all services
- [x] Volume persistence

## Success Criteria

- `prisma migrate dev` completes without errors
- `prisma db seed` populates all tables (23 total inc. lookup tables)
- `docker compose up` starts PG16 + Redis7 + API container
- OpenAPI spec generated at `/api/v1/docs`
- Health check returns 200 at `/api/v1/health`
- All FK constraints satisfied in seed data
- UTF-8 Vietnamese names render correctly in DB
- pg_trgm extension allows Vietnamese fuzzy search

## Risk Assessment

- **CCID encryption**: Medium risk — must be implemented at application layer before Phase B
- **Seed data fidelity**: Low risk — use realistic Vietnamese names/test data
- **Docker networking**: Low risk — simple bridge network with health checks
- **PostgreSQL extensions**: Low risk — extensions declared in Prisma schema

## Next Steps

After this phase, the following phases will be unblocked:
- **Phase B**: Authentication module (JWT strategy, login, register)
- **Phase C**: Role-based access control (guards, decorators)
- **Phase D**: Feature module stubs for all domain entities
- **Phase E**: Full CRUD implementation for Programs, Learners, Enrollments
- **Phase F**: MOA and Placement tracking
- **Phase G**: Invoice and Document management
