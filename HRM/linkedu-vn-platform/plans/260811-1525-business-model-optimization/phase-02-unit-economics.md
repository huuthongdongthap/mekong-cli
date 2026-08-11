# Phase 2 — Unit Economics Model & CAC/LTV Analysis

## Overview
- Priority: High
- Status: Pending
- Duration: 3-4 days

## Context Links
- Revenue model: `docs/revenue-model-cash-flow.md` lines 80-180
- AARRR metrics: `docs/master-consolidated-2026.md` lines 179-187
- Prisma models: School, Enterprise, Learner, Enrollment, Placement, Invoice
- Research gaps: `plans/reports/researcher-260811-1525-linkeduvn-b2b2c-optimization.json` (Unit Economics targets: School CAC payback 4.2mo, Enterprise 9.5mo)

## Key Insights
1. **No unit economics tracking in code** — All metrics in docs only
2. **Three distinct customer segments** with different economics:
   - **Schools**: High LTV, long sales cycle, low churn
   - **Enterprises**: Medium LTV, volume-driven, placement-fee dependent
   - **Learners**: Zero direct revenue, but drive network value
3. **Key metrics needed**: CAC, LTV, Payback Period, NRR, GRR per segment

## Requirements

### Functional
- [ ] Define unit economics formulas per segment
- [ ] Build analytics service for CAC/LTV calculation
- [ ] Create cohort analysis engine
- [ ] Implement real-time dashboard metrics
- [ ] Build forecasting model (Monte Carlo)
- [ ] Add segment-level P&L attribution

### Non-functional
- [ ] Calculations update daily (batch job)
- [ ] Historical snapshots for trend analysis
- [ ] Export to BI tools (CSV/Parquet)
- [ ] < 5s query for dashboard

## Architecture

### New Models (Prisma additions)
```prisma
model UnitEconomicsSnapshot {
  id              String   @id @default(uuid())
  segment         Segment  // SCHOOL | ENTERPRISE
  periodStart     DateTime @db.Date
  periodEnd       DateTime @db.Date
  // CAC components
  marketingSpend  Int      @default(0)
  salesSpend      Int      @default(0)
  onboardingCost  Int      @default(0)
  newCustomers    Int      @default(0)
  cacVnd          Int      // Computed
  // LTV components
  avgRevenuePerCustomer Int  // ARPU
  grossMarginPct      Float  // 0-100
  churnRatePct        Float  // Monthly
  ltvVnd              Int    // Computed
  paybackMonths       Float  // Computed
  // Retention
  nrrPct              Float  // Net Revenue Retention
  grrPct              Float  // Gross Revenue Retention
  // Cohorts
  cohortData          Json   // Cohort matrix
  createdAt           DateTime @default(now())
}

model CustomerCohort {
  id              String   @id @default(uuid())
  segment         Segment
  cohortMonth     DateTime @db.Date  // First month
  size            Int
  // Monthly retention/revenue
  month1Rev       Int? @default(0)
  month2Rev       Int? @default(0)
  month3Rev       Int? @default(0)
  month6Rev       Int? @default(0)
  month12Rev      Int? @default(0)
  month1Retained  Int? @default(0)
  month2Retained  Int? @default(0)
  month3Retained  Int? @default(0)
  month6Retained  Int? @default(0)
  month12Retained Int? @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([segment, cohortMonth])
}

// P1: Scholarship Fund Tracking (Research gap)
model ScholarshipFund {
  id              String   @id @default(uuid())
  name            String
  totalCommittedVnd Int    // Total pledged
  totalDeployedVnd  Int    // Total disbursed
  totalReturnsVnd   Int    // Returns (if any)
  status          FundStatus // ACTIVE | CLOSED | PAUSED
  startDate       DateTime @db.Date
  endDate         DateTime? @db.Date
  complianceRef   String?  // TT 23/2021 reference
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model ScholarshipPillar {
  id              String   @id @default(uuid())
  fundId          String
  fund            ScholarshipFund @relation(fields: [fundId], references: [id])
  name            String   // "Merit", "Need-based", "Enterprise-sponsored", "Alumni-funded"
  allocationPct   Float    // % of fund
  criteria        Json     // Eligibility rules
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model ScholarshipAllocation {
  id              String   @id @default(uuid())
  pillarId        String
  pillar          ScholarshipPillar @relation(fields: [pillarId], references: [id])
  learnerId       String
  amountVnd       Int
  status          AllocationStatus // APPROVED | DISBURSED | COMPLETED | CLAWBACK
  academicYear    String
  semester        String
  disbursedAt     DateTime?
  clawbackAt      DateTime?
  clawbackReason  String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// P1: Revenue Recognition (Research gap)
model RevenueRecognitionRule {
  id              String   @id @default(uuid())
  name            String
  revenueType     RevenueType // SETUP_FEE | PLACEMENT_FEE | SAAS | SCHOLARSHIP_ADMIN
  recognitionMethod Method // IMMEDIATE | RATCHET | STRAIGHT_LINE | MILESTONE
  config          Json     // { months, milestones, triggerEvents }
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model RevenueSchedule {
  id              String   @id @default(uuid())
  invoiceId       Int
  invoice         Invoice  @relation(fields: [invoiceId], references: [id])
  ruleId          String
  rule            RevenueRecognitionRule @relation(fields: [ruleId], references: [id])
  periodStart     DateTime @db.Date
  periodEnd       DateTime @db.Date
  amountVnd       Int
  recognizedVnd   Int      @default(0)
  status          ScheduleStatus // PENDING | PARTIAL | RECOGNIZED | DEFERRED
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## Formulas

### Schools (Research: CAC Payback 4.2 months)
```
CAC = (Marketing + Sales + Onboarding) / New Schools
ARPU = (Setup Fees + SaaS + Upsells) / Active Schools
LTV = ARPU × Gross Margin % / Monthly Churn %
Payback = CAC / (ARPU × Gross Margin % / 12)
Target: Payback < 6 months, LTV/CAC > 5
```

### Enterprises (Research: CAC Payback 9.5 months, needs expansion revenue)
```
CAC = (Marketing + Sales + Onboarding) / New Enterprises
ARPU = (Placement Fees × Placements/Enterprise + SaaS) / Active Enterprises
LTV = ARPU × Gross Margin % / Monthly Churn %
Payback = CAC / (ARPU × Gross Margin % / 12)
Target: Payback < 12 months (with expansion), LTV/CAC > 3
```

### Learners (Network Value - Research: Alumni referral 40% CAC reduction)
```
Network Value = Placements Generated × Avg Placement Fee
Referral Value = Referrals × Conversion Rate × LTV(Referred)
Total Learner Value = Network Value + Referral Value
Target: Viral coefficient > 0.3, Referral-sourced > 20%
```

## Implementation Steps

1. **Add Prisma models** — UnitEconomicsSnapshot, CustomerCohort, ScholarshipFund, ScholarshipPillar, ScholarshipAllocation, RevenueRecognitionRule, RevenueSchedule
2. **Create AnalyticsService** — Calculation engine for CAC/LTV
3. **Build CohortAnalysisService** — Monthly cohort tracking
4. **Create ScholarshipService** — Fund tracking, allocation, TT 23/2021 compliance
5. **Build RevenueRecognitionService** — ASC 606/VAS 14 compliance, deferred revenue
6. **Create Scheduled Jobs** — Daily/Monthly calculation (cron)
7. **Build MetricsController** — REST API for dashboard
8. **Add ForecastingService** — Monte Carlo simulation
9. **Seed historical data** — From existing invoices/enrollments
10. **Build dashboard widgets** — Real-time metrics in web
11. **Write tests** — Formula validation, edge cases, compliance rules

## Files to Modify/Create

### New Files
- `packages/api/prisma/schema.prisma` — Add analytics, scholarship, revenue recognition models
- `packages/api/src/modules/analytics/analytics.service.ts`
- `packages/api/src/modules/analytics/cohort.service.ts`
- `packages/api/src/modules/analytics/forecasting.service.ts`
- `packages/api/src/modules/analytics/analytics.controller.ts`
- `packages/api/src/modules/analytics/analytics.module.ts`
- `packages/api/src/modules/scholarships/scholarship.service.ts`
- `packages/api/src/modules/scholarships/scholarships.module.ts`
- `packages/api/src/modules/revenue-recognition/revenue-recognition.service.ts`
- `packages/api/src/modules/revenue-recognition/revenue-recognition.module.ts`
- `packages/api/src/jobs/unit-economics.job.ts` — Cron job
- `packages/api/test/analytics.service.spec.ts`
- `packages/api/test/scholarships.service.spec.ts`
- `packages/api/test/revenue-recognition.service.spec.ts`

### Modified Files
- `packages/api/src/modules/invoices/invoices.service.ts` — Emit events for analytics, trigger revenue recognition
- `packages/api/src/modules/enrollments/enrollments.service.ts` — Track cohort entry
- `packages/api/src/modules/placements/placements.service.ts` — Track placement revenue
- `packages/web/src/app/(dashboard)/page.tsx` — Add metrics widgets

## Todo List

- [ ] Add Prisma analytics models (snapshot, cohort)
- [ ] Add Prisma scholarship models (fund, pillar, allocation)
- [ ] Add Prisma revenue recognition models (rule, schedule)
- [ ] Run migration
- [ ] Create AnalyticsModule
- [ ] Implement CAC/LTV formulas with research targets
- [ ] Build cohort analysis engine
- [ ] Create daily calculation cron job
- [ ] Build forecasting (Monte Carlo, 1000 runs)
- [ ] Create REST API endpoints
- [ ] Seed 12 months historical data
- [ ] Build dashboard widgets
- [ ] Implement ScholarshipService (TT 23/2021 compliance)
- [ ] Implement RevenueRecognitionService (ASC 606/VAS 14)
- [ ] Write unit tests (formula accuracy, compliance rules)
- [ ] Document formulas in README

## Success Criteria
- [ ] CAC/LTV calculated daily for each segment
- [ ] Cohort retention matrix accurate (validated vs raw data)
- [ ] **School payback < 6 months, LTV/CAC > 5** (research target)
- [ ] **Enterprise payback < 12 months with expansion, LTV/CAC > 3** (research target)
- [ ] NRR > 100% (expansion > churn)
- [ ] Forecasting MAPE < 15% (Mean Absolute Percentage Error)
- [ ] Dashboard loads < 2s
- [ ] **Scholarship fund tracking compliant with TT 23/2021**
- [ ] **Revenue recognition per ASC 606/VAS 14**
- [ ] All tests pass

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Insufficient historical data | High | Medium | Use industry benchmarks, bootstrap with assumptions |
| Formula errors | Medium | High | Property-based testing, cross-validate with finance |
| Data quality issues | Medium | Medium | Data validation pipeline, anomaly detection |

## Next Steps
- Phase 3: Flywheel Design (uses unit economics as input)
- Phase 4: Expansion Revenue (uses LTV to justify upsell investment)