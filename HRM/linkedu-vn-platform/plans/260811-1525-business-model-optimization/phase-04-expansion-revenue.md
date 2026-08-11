# Phase 4 — Expansion Revenue & Upsell Engine

## Overview
- Priority: Medium
- Status: Pending
- Duration: 3-4 days

## Context Links
- Revenue model: `docs/revenue-model-cash-flow.md` lines 180-250
- Current modules: Invoices, Programs, Enterprises, Schools, Learners
- Unit economics (Phase 2): LTV targets drive upsell investment
- Research: `plans/reports/researcher-260811-1525-linkeduvn-b2b2c-optimization.json` (Expansion revenue: LMI Reports 24B VND Y3, HRIS Integration 9B VND, Faculty Upskilling 10B VND = highest leverage)

## Key Insights
1. **Current revenue = 3 streams only** — Setup, Placement, SaaS
2. **High LTV segments justify upsell investment** — School LTV ~500M VND, Enterprise ~300M VND
3. **Natural expansion paths exist** but not systematized
4. **Scholarship fund** (5-10% revenue) can be monetized via corporate sponsorship

## Expansion Revenue Opportunities (Research Targets: ~50B VND Y3)

### Platform-Level Revenue (Research: Highest Leverage)
| Product | Target | Pricing Model | Y3 Revenue Target |
|---------|--------|---------------|-------------------|
| **LMI Reports** | Gov/Industry/Enterprises | 100-500M VND/report | 24B VND |
| **HRIS Integration** | Enterprise HR systems | 50-200M VND/year | 9B VND |
| **Faculty Upskilling** | Enterprise-funded teacher training | 5-15M VND/course | 10B VND |
| **Scholarship Fund Mgmt** | Corporate CSR | 5-10% admin fee | 5B VND |
| **API Access** | HRIS/ATS integration | 50-200M VND/year | 2B VND |

### School-Side Upsells
| Product | Target | Pricing Model | Est. Attach Rate |
|---------|--------|---------------|------------------|
| **Curriculum Marketplace** | Schools buying verified curricula | 10-20% take-rate | 30% |
| **Faculty Upskilling** | Enterprise-funded teacher training | 5-15M VND/course | 40% |
| **Accreditation Support** | MOET compliance consulting | 50-200M VND/project | 20% |
| **LMS White-label** | Branded learning platform | 20-50M VND/month | 25% |
| **Data & Benchmarking** | Industry salary/skill reports | 10-30M VND/report | 35% |

### Enterprise-Side Upsells
| Product | Target | Pricing Model | Est. Attach Rate |
|---------|--------|---------------|------------------|
| **Talent Pipeline Subscription** | Early access to graduates | 10-30M VND/month | 45% |
| **Custom Assessment** | Role-specific skill tests | 5-20M VND/assessment | 30% |
| **Employer Branding** | Campus ambassador programs | 20-100M VND/campaign | 25% |
| **Workforce Planning** | Skills gap analysis | 50-200M VND/project | 15% |
| **Alumni Access** | Re-hire former interns | 5-10M VND/month | 35% |

### Learner-Side Upsells (Premium)
| Product | Target | Pricing Model | Est. Attach Rate |
|---------|--------|---------------|------------------|
| **Career Coaching** | 1:1 sessions | 500K-1M VND/session | 15% |
| **Certificate Verification** | Blockchain-verified credentials | 200K VND/cert | 40% |
| **Job Match Priority** | Top-of-funnel placement | 1M VND/month | 20% |
| **Skill Assessment** | Adaptive testing | 300K VND/test | 25% |
| **Mentor Network** | Industry mentor matching | 2M VND/month | 10% |

### Research: Placement Fee Automation (P1 Gap)
| Feature | Description |
|---------|-------------|
| **Milestone Billing** | 30% deposit on contract, 70% on placement start |
| **Clawback** | Refund if learner leaves < 90 days |
| **Auto-invoice** | Trigger from Placement.status = COMPLETED |

## Architecture

### New Models (Prisma additions)
```prisma
model ExpansionProduct {
  id              String   @id @default(uuid())
  code            String   @unique
  name            String
  description     String?  @db.Text
  segment         Segment  // SCHOOL | ENTERPRISE | LEARNER | PLATFORM
  category        ProductCategory // MARKETPLACE | SERVICE | SAAS | DATA | PREMIUM | PLATFORM
  pricingModel    PricingModel // PERCENTAGE | FIXED | SUBSCRIPTION | USAGE
  basePriceVnd    Int
  currency        String   @default("VND")
  minCommitment   Int?     // Months
  isActive        Boolean  @default(true)
  metadata        Json     // Features, limits, SLA
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model ExpansionSubscription {
  id              String   @id @default(uuid())
  productId       String
  product         ExpansionProduct @relation(fields: [productId], references: [id])
  entityId        String   // School/Enterprise/Learner ID
  entityType      Segment
  status          SubStatus // ACTIVE | PAUSED | CANCELLED | TRIAL
  currentPriceVnd Int      // May differ from base (discounts)
  billingCycle    BillingCycle // MONTHLY | QUARTERLY | ANNUAL
  startedAt       DateTime
  renewsAt        DateTime
  cancelledAt     DateTime?
  metadata        Json
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model UpsellOpportunity {
  id              String   @id @default(uuid())
  entityId        String
  entityType      Segment
  productId       String
  product         ExpansionProduct @relation(fields: [productId], references: [id])
  score           Float    // 0-1, ML propensity score
  reason          String   // Why this opportunity
  estimatedValueVnd Int
  status          OppStatus // NEW | CONTACTED | PROPOSAL | CLOSED_WON | CLOSED_LOST
  assignedToId    String?  // Sales rep
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// P1: Placement Fee Automation (Research gap)
model PlacementBillingRule {
  id              String   @id @default(uuid())
  name            String
  depositPct      Int      @default(30)  // 30% on contract
  balancePct      Int      @default(70)  // 70% on start
  clawbackDays    Int      @default(90)  // Refund if leaves < 90 days
  clawbackPct     Int      @default(100) // % to refund
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model PlacementInvoiceSchedule {
  id              String   @id @default(uuid())
  placementId     Int
  placement       Placement @relation(fields: [placementId], references: [id])
  ruleId          String
  rule            PlacementBillingRule @relation(fields: [ruleId], references: [id])
  invoiceId       Int?
  invoice         Invoice? @relation(fields: [invoiceId], references: [id])
  amountVnd       Int
  type            InvoiceType // DEPOSIT | BALANCE | CLAWBACK
  status          ScheduleStatus // PENDING | GENERATED | PAID | REFUNDED
  scheduledAt     DateTime
  generatedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// P1: Scholarship Fund Admin Fee (Platform revenue)
model ScholarshipAdminFee {
  id              String   @id @default(uuid())
  fundId          String
  periodStart     DateTime @db.Date
  periodEnd       DateTime @db.Date
  feePct          Float    // 5-10%
  feeAmountVnd    Int
  status          FeeStatus // PENDING | INVOICED | PAID
  invoiceId       Int?
  invoice         Invoice? @relation(fields: [invoiceId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## Implementation Steps

1. **Add Prisma models** — ExpansionProduct, ExpansionSubscription, UpsellOpportunity
2. **Create ProductCatalogService** — Manage expansion products
3. **Build SubscriptionService** — Lifecycle management (trial, renew, cancel)
4. **Create PropensityModel** — ML-based upsell scoring (start: rule-based)
5. **Build OpportunityEngine** — Auto-generate upsell opportunities
6. **Create SalesAssistTools** — CRM-lite for upsell tracking
7. **Integrate with Invoices** — Auto-bill subscriptions
8. **Build UpsellDashboard** — Pipeline + revenue forecast
9. **Seed initial product catalog** — 15+ products from table above
10. **Write tests** — Subscription lifecycle, propensity scoring

## Files to Modify/Create

### New Files
- `packages/api/prisma/schema.prisma` — Add expansion models
- `packages/api/src/modules/expansion/product-catalog.service.ts`
- `packages/api/src/modules/expansion/subscription.service.ts`
- `packages/api/src/modules/expansion/propensity.service.ts`
- `packages/api/src/modules/expansion/opportunity.service.ts`
- `packages/api/src/modules/expansion/expansion.controller.ts`
- `packages/api/src/modules/expansion/expansion.module.ts`
- `packages/api/src/jobs/upsell-opportunity.job.ts`
- `packages/api/test/expansion.service.spec.ts`

### Modified Files
- `packages/api/src/modules/invoices/invoices.service.ts` — Subscription billing
- `packages/api/src/modules/schools/schools.service.ts` — Upsell context
- `packages/api/src/modules/enterprises/enterprises.service.ts` — Upsell context
- `packages/api/src/modules/learners/learners.service.ts` — Premium features
- `packages/web/src/app/(dashboard)/enterprises/[id]/page.tsx` — Upsell panel
- `packages/web/src/app/(dashboard)/schools/[id]/page.tsx` — Upsell panel

## Todo List

- [ ] Add Prisma expansion models
- [ ] Run migration
- [ ] Create ExpansionModule
- [ ] Seed 15+ expansion products
- [ ] Build subscription lifecycle (trial → active → renew/cancel)
- [ ] Implement rule-based propensity scoring (v1)
- [ ] Auto-generate upsell opportunities daily
- [ ] Build sales assist dashboard
- [ ] Integrate subscription billing with invoices
- [ ] Create LMI report product (platform revenue)
- [ ] Design Scholarship Fund admin fee structure
- [ ] Write tests (>80% coverage)
- [ ] Document sales playbook per product

## Success Criteria
- [ ] Expansion revenue > 30% of total by Month 12
- [ ] Average products/customer > 1.5 (Schools), > 1.3 (Enterprises)
- [ ] Upsell conversion rate > 20% (opportunity → closed-won)
- [ ] Propensity model AUC > 0.75
- [ ] Subscription churn < 5% monthly
- [ ] All tests pass

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Feature creep dilutes core | Medium | High | Strict product review gate, sunset clause |
| Sales team bandwidth | High | Medium | Product-led growth, self-serve where possible |
| Pricing cannibalization | Low | Medium | Clear tier boundaries, value-based pricing |

## Next Steps
- Phase 5: Regulatory Risk (expansion products may need licenses)
- Phase 7: Roadmap (prioritize by ROI)