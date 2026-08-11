# Phase 3 — Network Effects & Flywheel Design

## Overview
- Priority: High
- Status: Pending
- Duration: 2-3 days

## Context Links
- Business model: `docs/business-model-superior.md` lines 15-45
- Master doc: `docs/master-consolidated-2026.md` lines 45-55 (ecosystem diagram)
- Current modules: MOA, Programs, Enrollments, Placements, Chat
- Research: `plans/reports/researcher-260811-1525-linkeduvn-b2b2c-optimization.json` (Flywheel design: VST taxonomy, alumni referral 40% CAC reduction, target 50% referrals by Y3)

## Key Insights
1. **Three-sided network** — Schools ↔ Enterprises ↔ Learners
2. **Current flywheel is implicit** — Not instrumented or optimized
3. **Core loop**: More Schools → More Programs → More Learners → More Placements → More Enterprise Demand → More Schools
4. **Missing**: Cross-side virality, referral loops, data network effects

## Requirements

### Functional
- [ ] Map all network effects (direct, cross-side, data)
- [ ] Design measurable flywheel loops with KPIs
- [ ] Build referral/ambassador program engine
- [ ] Implement cross-side recommendation engine
- [ ] Create network health dashboard
- [ ] Build viral coefficient tracking

### Non-functional
- [ ] Flywheel metrics update real-time
- [ ] Recommendation latency < 200ms
- [ ] Support 10,000+ nodes in network graph

## Flywheel Design (from Research)

### Loop 1: Supply-Side Flywheel (Schools → Programs → Learners)
```
More Schools onboarded
    ↓
More CTĐT programs published (validated by MOAs)
    ↓
More Learner enrollment options
    ↓
Higher enrollment conversion
    ↓
More revenue per School (SaaS + Setup fees)
    ↓
Schools renew & expand → Refer other Schools
    ↓ (loop)
```

**KPIs**: Schools onboarded/month, Programs/School, Enrollment rate, School NRR
**Research Target**: School CAC payback 4.2 months

### Loop 2: Demand-Side Flywheel (Enterprises → Placements → Learners → Enterprises)
```
More Enterprises join
    ↓
More placement demand (positions posted)
    ↓
More Learner placements completed
    ↓
Placement fee revenue + Success stories
    ↓
Enterprises renew & increase volume
    ↓
Enterprises refer peers → More Enterprises
    ↓ (loop)
```

**KPIs**: Enterprises active, Placements/Enterprise, Placement fee revenue, Enterprise NRR
**Research Target**: Enterprise CAC payback 9.5 months (needs expansion revenue to improve)

### Loop 3: Learner Flywheel (Learners → Outcomes → Referrals → Learners)
```
More Learners enroll
    ↓
Complete programs → Get placed
    ↓
High satisfaction (NPS > 50)
    ↓
Refer friends / Become ambassadors (1M VND/placement referral)
    ↓
Organic learner acquisition (CAC → 0) — Research: 40% CAC reduction
    ↓
More Learners
    ↓ (loop)
```

**KPIs**: Learner activation D90, Placement rate, NPS, Referral rate, Viral coefficient (K-factor)
**Research Target**: 50% placements from referrals by Y3, K-factor > 0.3

### Loop 4: Data Network Effect (Cross-cutting) — Vietnam Skills Taxonomy (VST)
```
All interactions → Rich dataset (VST: standardized skills mapped to QCVN)
    ↓
Better matching (School-Enterprise, Learner-Program, Learner-Job)
    ↓
Higher conversion at every step
    ↓
More data → VST compounds with each placement
    ↓ (loop)
```

**KPIs**: Matching accuracy, Conversion rate improvement, VST coverage %, Data moat depth
**Research**: VST is proprietary data compounding moat

## Architecture

### New Models (Prisma additions)
```prisma
model ReferralProgram {
  id              String   @id @default(uuid())
  name            String
  segment         Segment  // SCHOOL | ENTERPRISE | LEARNER
  referrerReward  Json     // { type: CREDIT | CASH | TIER_UPGRADE, value }
  refereeReward   Json
  maxReferrals    Int?
  isActive        Boolean  @default(true)
  startDate       DateTime?
  endDate         DateTime?
  createdAt       DateTime @default(now())
}

model Referral {
  id              String   @id @default(uuid())
  programId       String
  program         ReferralProgram @relation(fields: [programId], references: [id])
  referrerId      String   // User/School/Enterprise ID
  referrerType    Segment
  refereeId       String
  refereeType     Segment
  status          ReferralStatus // PENDING | QUALIFIED | REWARDED | EXPIRED
  qualifiedAt     DateTime?
  rewardedAt      DateTime?
  metadata        Json
  createdAt       DateTime @default(now())
}

model NetworkMetric {
  id              String   @id @default(uuid())
  date            DateTime @db.Date
  // Supply side
  activeSchools   Int
  activePrograms  Int
  // Demand side
  activeEnterprises Int
  openPositions   Int
  // Learner side
  activeLearners  Int
  enrolledLearners Int
  placedLearners  Int
  // Cross metrics
  matchesMade     Int
  conversionRate  Float
  viralCoefficient Float   // K-factor
  avgTimeToMatch  Int       // Days
  createdAt       DateTime @default(now())
  
  @@unique([date])
}

model MatchingEvent {
  id              String   @id @default(uuid())
  type            MatchType // PROGRAM_ENROLLMENT | PLACEMENT | SCHOOL_ENTERPRISE_MOA
  entityAId       String
  entityAType     Segment
  entityBId       String
  entityBType     Segment
  score           Float    // Matching algorithm score
  outcome         Outcome  // CONVERTED | REJECTED | EXPIRED
  metadata        Json
  createdAt       DateTime @default(now())
}

// Research: Vietnam Skills Taxonomy (VST) - proprietary data moat
model SkillTaxonomy {
  id              String   @id @default(uuid())
  code            String   @unique  // VST-IT-001, VST-LOG-005
  name            String
  nameEn          String?
  category        String   // IT, LOGISTICS, HEALTHCARE, MANUFACTURING, etc.
  level           Int      // 1-5 (entry to expert)
  parentId        String?
  parent          SkillTaxonomy? @relation("SkillHierarchy", fields: [parentId], references: [id])
  children        SkillTaxonomy[] @relation("SkillHierarchy")
  qcvnMapping     String?  // QCVN standard reference
  demandScore     Float    // 0-1, market demand
  supplyScore     Float    // 0-1, graduate supply
  avgSalaryVnd    Int?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model ProgramSkillMap {
  id              String   @id @default(uuid())
  programId       Int
  program         Program  @relation(fields: [programId], references: [id])
  skillId         String
  skill           SkillTaxonomy @relation(fields: [skillId], references: [id])
  proficiencyLevel Int     // 1-5
  isCore          Boolean  @default(true)
  weight          Float    // Importance in curriculum
  createdAt       DateTime @default(now())
}

model PlacementSkillMatch {
  id              String   @id @default(uuid())
  placementId     Int
  placement       Placement @relation(fields: [placementId], references: [id])
  skillId         String
  skill           SkillTaxonomy @relation(fields: [skillId], references: [id])
  requiredLevel   Int
  assessedLevel   Int
  gap             Int      // required - assessed
  createdAt       DateTime @default(now())
}
```

## Implementation Steps

1. **Add Prisma models** — ReferralProgram, Referral, NetworkMetric, MatchingEvent
2. **Create ReferralService** — Program management, tracking, rewards
3. **Build MatchingService** — Recommendation engine (collaborative filtering + content-based)
4. **Create NetworkAnalyticsService** — Flywheel metric calculation
5. **Add Scheduled Jobs** — Daily network metric snapshots
6. **Build MatchingEventTracker** — Instrument all conversion points
7. **Create NetworkDashboard** — Real-time flywheel visualization
8. **Implement Ambassador Program** — Learner referral with tiered rewards
9. **Write tests** — Matching accuracy, referral tracking, viral coefficient

## Files to Modify/Create

### New Files
- `packages/api/prisma/schema.prisma` — Add network models
- `packages/api/src/modules/referrals/referrals.service.ts`
- `packages/api/src/modules/referrals/referrals.controller.ts`
- `packages/api/src/modules/referrals/referrals.module.ts`
- `packages/api/src/modules/matching/matching.service.ts`
- `packages/api/src/modules/network/network-analytics.service.ts`
- `packages/api/src/modules/network/network.controller.ts`
- `packages/api/src/jobs/network-metrics.job.ts`
- `packages/api/test/matching.service.spec.ts`
- `packages/api/test/referrals.service.spec.ts`

### Modified Files
- `packages/api/src/modules/enrollments/enrollments.service.ts` — Track matching events
- `packages/api/src/modules/placements/placements.service.ts` — Track placement matches
- `packages/api/src/modules/moas/moas.service.ts` — Track School-Enterprise matches
- `packages/web/src/app/(dashboard)/page.tsx` — Add network health widgets

## Todo List

- [ ] Add Prisma network models
- [ ] Run migration
- [ ] Create ReferralsModule
- [ ] Implement referral tracking & rewards
- [ ] Build MatchingService (v1: content-based, v2: collaborative)
- [ ] Instrument all conversion points with MatchingEvent
- [ ] Create NetworkAnalyticsService
- [ ] Build daily metrics cron job
- [ ] Calculate viral coefficient (K-factor)
- [ ] Build network health dashboard
- [ ] Launch Learner Ambassador Program
- [ ] Write tests (matching accuracy > 75%)

## Success Criteria
- [ ] Viral coefficient (K-factor) > 0.3 within 6 months
- [ ] Referral-sourced learners > 20% of new enrollments
- [ ] Cross-side matches (School↔Enterprise) > 50/month
- [ ] Matching algorithm improves conversion by > 15%
- [ ] All flywheel loops have measurable KPIs updating daily
- [ ] Network health dashboard loads < 3s
- [ ] All tests pass

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low initial network density | High | Medium | Seed with manual matches, incentive early adopters |
| Gaming referral system | Medium | High | Fraud detection, qualification gates, delayed rewards |
| Matching algorithm bias | Medium | Medium | A/B testing, fairness audits, human-in-the-loop |

## Next Steps
- Phase 4: Expansion Revenue (uses network effects for upsell)
- Phase 5: Regulatory Risk (network effects may attract scrutiny)