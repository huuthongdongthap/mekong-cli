# Plan — Business Model Optimization Deep Check

**Date:** 2026-08-11
**Goal:** Tối ưu hóa mô hình kinh doanh B2B2C của LinkEduVN thông qua deep check: pricing, unit economics, network effects, expansion revenue, regulatory risk mitigation

## Phases Overview

| Phase | Name | Status | Priority |
|-------|------|--------|----------|
| 1 | Pricing Architecture Redesign | Pending | High |
| 2 | Unit Economics Model & CAC/LTV | Pending | High |
| 3 | Network Effects & Flywheel Design | Pending | High |
| 4 | Expansion Revenue & Upsell Engine | Pending | Medium |
| 5 | Regulatory Risk Mitigation Framework | Pending | High |
| 6 | Competitive Moat Strengthening | Pending | Medium |
| 7 | Implementation Roadmap & KPIs | Pending | High |

## Dependencies

- Phase 1 must complete first (pricing foundation)
- Phases 2-3 can run in parallel (economics + flywheel)
- Phases 4-6 can run in parallel after 2-3
- Phase 7 requires all prior phases

## Key Insights from Research

### Current State Gaps (Codebase Analysis: 18 files, ~2,280 lines)
| Gap | Priority | Files to Create/Modify |
|-----|----------|------------------------|
| **Pricing Tiers** | P0 | `prisma/schema.prisma` (Plan, PricingTier, RateCard), `src/raas/billing_engine.py`, `invoices.dto.ts` |
| **Payment Gateway** | P0 | `payment_gateway.ts` interface, VNPay/MoMo/Stripe adapters, `modules/payments/` |
| **Recurring Billing** | P0 | `Subscription`, `BillingCycle` models, billing scheduler, proration, dunning |
| **Scholarship Fund** | P1 | `ScholarshipFund`, `ScholarshipPillar`, `ScholarshipAllocation` models, TT 23/2021 compliance |
| **Revenue Recognition** | P1 | `RevenueRecognitionRule`, `RevenueSchedule` models, ASC 606/VAS 14 compliance |
| **Placement Fee Automation** | P1 | Placement→Invoice automation, clawback, milestone billing (30/70 split) |
| **Multi-entity VAT** | P1 | `LegalEntity`, `VATClassification` models, per-line VAT calculation |

### Existing Strengths
- Prisma schema well-designed for Vietnam (VND integer, soft delete, CCCD encryption)
- Invoice model supports polymorphic school/enterprise/learner relationships
- Program model includes QD788 fields (practicalTrainingRatio, enterpriseGvRatio)
- Placement model tracks international pathways (SSW/EPS/GIZ)
- Audit trail infrastructure exists (`src/raas/audit_trail.py`)

### Benchmarking Targets
| Platform | Model | Key Insight |
|----------|-------|-------------|
| Coursera for Business | SaaS + content marketplace | Tiered per-seat pricing |
| Guild Education | Employer-paid education | Outcome-based contracts |
| Multiverse | Apprenticeship platform | Placement-fee + training revenue |
| Degreed | Skills platform | Enterprise license + marketplace take-rate |

## Success Criteria

- [ ] Pricing tiers defined for all 3 segments (School, Enterprise, Learner)
- [ ] Unit economics model with CAC/LTV/payback per segment
- [ ] Flywheel mechanics documented with measurable loop metrics
- [ ] Expansion revenue playbook (3+ upsell paths per segment)
- [ ] Regulatory risk register with mitigation actions
- [ ] Competitive moat matrix with 5+ defensibility factors
- [ ] 12-month implementation roadmap with quarterly milestones

## Unresolved Questions (from Research)

1. **Enterprise WTP**: Actual willingness-to-pay at 3M vs 5M VND placement fee? (needs pilot)
2. **Scholarship Fund**: Path to 50B VND AUM by Y3 without philanthropy?
3. **Luật GD 2027**: Will platform licensing be required? (monitoring)
4. **Sales Model**: Direct enterprise sales (high CAC, high control) vs recruitment agency channel?
5. **School Onboarding**: 3 vs 6 months timeline (affects CAC payback)
6. **Payment Gateway**: VNPay (domestic) vs Stripe (international SSW/EPS)?
7. **Revenue Recognition**: VAS 14 ruling vs ASC 606 for investor readiness?
8. **Subscription Billing**: Build in-house vs Paddle/Lago/Stripe Billing?