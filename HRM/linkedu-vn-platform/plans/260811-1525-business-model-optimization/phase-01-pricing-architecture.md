# Phase 1 — Pricing Architecture Redesign

## Overview
- Priority: High
- Status: Pending
- Duration: 2-3 days

## Context Links
- Current pricing (docs): `docs/business-model-superior.md` lines 45-85
- Revenue model: `docs/revenue-model-cash-flow.md` lines 15-80
- Invoice module: `packages/api/src/modules/invoices/`
- Program module: `packages/api/src/modules/programs/`
- Research gaps: `plans/reports/researcher-260811-1525-linkeduvn-b2b2c-optimization.json` (P0: Pricing Tiers, Payment Gateway, Recurring Billing)

## Key Insights
1. **Current pricing is document-only** — No code implementation
4. **Three revenue streams** need tiered pricing:
   - School side: CTĐT Setup Fee + SaaS subscription
   - Enterprise side: Placement Fee + SaaS + Volume discounts
   - Learner side: Free (core) + Premium upsells
5. **Missing**: Dynamic pricing, volume discounts, seasonal promos, contract terms

## Requirements

### Functional
- [ ] Define pricing tiers for Schools (3 tiers: Starter, Growth, Enterprise)
- [ ] Define pricing tiers for Enterprises (3 tiers: Basic, Pro, Strategic)
- [ ] Define Learner premium features (Career coaching, Certificate verification, Job matching priority)
- [ ] Build pricing configuration service (database-driven)
- [ ] Implement volume discount engine
- [ ] Add contract term pricing (monthly/quarterly/annual)
- [ ] Support promotional codes & seasonal pricing
- [ ] **Payment Gateway Integration** (P0): VNPay, MoMo, Stripe adapters with unified interface
- [ ] **Recurring Billing** (P0): Subscription model, billing scheduler, proration, dunning
- [ ] **Multi-entity VAT** (P1): LegalEntity, VATClassification models, per-line VAT calculation

### Non-functional
- [ ] Pricing changes without code deploy
- [ ] Audit trail for all price changes
- [ ] Multi-currency ready (VND primary, USD for intl)
- [ ] Tax calculation integration (VAT 8-10%)
- [ ] Payment webhook handling (async, idempotent)

## Architecture

### New Models (Prisma additions)
```prisma
model PricingTier {
  id            String   @id @default(uuid())
  name          String   @unique
  segment       Segment  // SCHOOL | ENTERPRISE | LEARNER
  tierLevel     Int      // 1, 2, 3
  basePriceVnd  Int      // Monthly base
  setupFeeVnd   Int?     // One-time
  features      Json     // Feature flags per tier
  limits        Json     // Usage limits
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model PricingRule {
  id            String   @id @default(uuid())
  tierId        String
  tier          PricingTier @relation(fields: [tierId], references: [id])
  ruleType      RuleType // VOLUME_DISCOUNT | CONTRACT_TERM | PROMO | SEASONAL
  config        Json     // { minVolume, discountPct, months, promoCode, ... }
  startDate     DateTime?
  endDate       DateTime?
  isActive      Boolean  @default(true)
}

model PriceQuote {
  id            String   @id @default(uuid())
  entityId      String   // schoolId or enterpriseId
  entityType    Segment
  tierId        String
  appliedRules  Json     // Rules applied
  finalPriceVnd Int      // Computed final
  currency      String   @default("VND")
  validUntil    DateTime
  status        QuoteStatus // DRAFT | SENT | ACCEPTED | EXPIRED
  createdAt     DateTime @default(now())
}

// P0: Payment Gateway
model PaymentGateway {
  id            String   @id @default(uuid())
  name          String   @unique  // VNPAY | MOMO | STRIPE | SEPAY
  type          GatewayType
  config        Json     // API keys, endpoints, secrets (encrypted)
  isActive      Boolean  @default(true)
  isTestMode    Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model PaymentTransaction {
  id              String   @id @default(uuid())
  gatewayId       String
  gateway         PaymentGateway @relation(fields: [gatewayId], references: [id])
  invoiceId       Int?
  invoice         Invoice? @relation(fields: [invoiceId], references: [id])
  amountVnd       Int
  currency        String   @default("VND")
  status          TransactionStatus // PENDING | PROCESSING | SUCCESS | FAILED | REFUNDED
  gatewayRef      String?  // External transaction ID
  responseData    Json?
  errorMessage    String?
  createdAt       DateTime @default(now())
  completedAt     DateTime?
}

// P0: Recurring Billing
model Subscription {
  id              String   @id @default(uuid())
  entityId        String   // School/Enterprise ID
  entityType      Segment
  tierId          String
  tier            PricingTier @relation(fields: [tierId], references: [id])
  status          SubStatus // ACTIVE | PAST_DUE | CANCELLED | TRIALING | PAUSED
  billingCycle    BillingCycle // MONTHLY | QUARTERLY | ANNUAL
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAtPeriodEnd  Boolean @default(false)
  cancelledAt        DateTime?
  trialEnd           DateTime?
  metadata           Json
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model BillingSchedule {
  id              String   @id @default(uuid())
  subscriptionId  String
  subscription    Subscription @relation(fields: [subscriptionId], references: [id])
  invoiceId       Int?
  invoice         Invoice? @relation(fields: [invoiceId], references: [id])
  amountVnd       Int
  status          ScheduleStatus // PENDING | GENERATED | PAID | FAILED | SKIPPED
  scheduledAt     DateTime
  generatedAt     DateTime?
  metadata        Json
  createdAt       DateTime @default(now())
}

// P1: Multi-entity VAT
model LegalEntity {
  id              String   @id @default(uuid())
  name            String
  type            EntityType // EDCO | TECHCO
  taxCode         String   @unique
  vatRate         Float    // 0 for EdCo, 10 for TechCo
  address         String
  isDefault       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model VATClassification {
  id              String   @id @default(uuid())
  productCode     String   @unique
  description     String
  vatRate         Float
  legalEntityId   String
  legalEntity     LegalEntity @relation(fields: [legalEntityId], references: [id])
  isActive        Boolean  @default(true)
}
```

## Implementation Steps

1. **Add Prisma models** — pricing_tier, pricing_rule, price_quote, payment_gateway, payment_transaction, subscription, billing_schedule, legal_entity, vat_classification
2. **Create PricingService** — Core pricing engine with tier lookup, rule application
3. **Build PricingController** — REST API for tier CRUD, quote generation
4. **Add pricing to Programs** — Link program to pricing tier
5. **Add pricing to Invoices** — Auto-calculate from pricing engine
6. **Build admin UI** — Tier management in dashboard
7. **Seed default tiers** — 3 tiers per segment with Vietnam-market pricing
8. **Write tests** — Unit tests for pricing calculations
9. **Implement PaymentGatewayService** — Unified interface for VNPay, MoMo, Stripe, SePay
10. **Build webhook handlers** — Async, idempotent payment confirmation
11. **Create SubscriptionService** — Lifecycle management, billing scheduler, proration, dunning
12. **Implement LegalEntity/VAT service** — Per-line VAT calculation, EdCo/TechCo separation
13. **Integrate with existing invoices** — Auto-generate from subscriptions

## Files to Modify/Create

### New Files
- `packages/api/prisma/schema.prisma` — Add pricing, payment, subscription, VAT models
- `packages/api/src/modules/pricing/pricing.service.ts`
- `packages/api/src/modules/pricing/pricing.controller.ts`
- `packages/api/src/modules/pricing/pricing.module.ts`
- `packages/api/src/modules/pricing/dto/pricing.dto.ts`
- `packages/api/src/modules/pricing/pricing.guard.ts`
- `packages/api/test/pricing.service.spec.ts`
- `packages/api/src/modules/payments/payment-gateway.service.ts`
- `packages/api/src/modules/payments/vnpay.adapter.ts`
- `packages/api/src/modules/payments/momo.adapter.ts`
- `packages/api/src/modules/payments/stripe.adapter.ts`
- `packages/api/src/modules/payments/sepay.adapter.ts`
- `packages/api/src/modules/payments/payments.controller.ts`
- `packages/api/src/modules/payments/payments.module.ts`
- `packages/api/src/modules/subscriptions/subscription.service.ts`
- `packages/api/src/modules/subscriptions/billing-scheduler.ts`
- `packages/api/src/modules/subscriptions/dunning.service.ts`
- `packages/api/src/modules/subscriptions/subscriptions.module.ts`
- `packages/api/src/modules/vat/legal-entity.service.ts`
- `packages/api/src/modules/vat/vat-classification.service.ts`
- `packages/api/src/modules/vat/vat.module.ts`

### Modified Files
- `packages/api/src/modules/invoices/invoices.service.ts` — Use pricing engine, subscription billing
- `packages/api/src/modules/programs/programs.service.ts` — Link pricing tier
- `packages/api/src/modules/enterprises/enterprises.service.ts` — Tier assignment, legal entity
- `packages/api/src/modules/schools/schools.service.ts` — Tier assignment, legal entity

## Todo List

- [ ] Add Prisma pricing models (tier, rule, quote)
- [ ] Add Prisma payment models (gateway, transaction)
- [ ] Add Prisma subscription models (subscription, billing_schedule)
- [ ] Add Prisma VAT models (legal_entity, vat_classification)
- [ ] Run migration
- [ ] Create PricingModule with service/controller
- [ ] Implement tier CRUD
- [ ] Implement rule engine (volume, contract, promo)
- [ ] Build quote generation API
- [ ] Integrate with invoices module
- [ ] Integrate with programs module
- [ ] Seed default Vietnam pricing tiers
- [ ] Write unit tests (target >80% coverage)
- [ ] Update API docs (Swagger)
- [ ] Implement PaymentGatewayService (P0)
- [ ] Build VNPay, MoMo, Stripe, SePay adapters (P0)
- [ ] Create webhook handlers (P0)
- [ ] Build SubscriptionService with lifecycle (P0)
- [ ] Implement billing scheduler with proration/dunning (P0)
- [ ] Implement LegalEntity/VAT separation (P1)
- [ ] Integrate subscription billing with invoices (P0)

## Success Criteria
- [ ] Pricing tiers configurable via API (no code deploy)
- [ ] Quote generation < 100ms p99
- [ ] Volume discounts calculate correctly
- [ ] Contract term pricing (monthly/quarterly/annual) works
- [ ] Promo codes apply correctly
- [ ] All tests pass
- [ ] Admin can manage tiers in dashboard

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Pricing complexity slows sales | Medium | High | Start simple (3 tiers), add complexity iteratively |
| Existing invoices break | Low | High | Backward compatibility layer, migration script |
| Regulatory price controls | Low | Medium | Configurable caps, legal review gate |

## Next Steps
- Phase 2: Unit Economics Model (depends on pricing tiers)
- Phase 3: Flywheel Design (depends on pricing structure)