# Phase 5 — Regulatory Risk Mitigation Framework

## Overview
- Priority: High
- Status: Pending
- Duration: 2-3 days

## Context Links
- Legal doc: `docs/legal-compliance-2026.md` (full)
- Key laws: Education Law 2019, Decree 788/2020, Decree 61/2024, Circular 02/2024
- Decree 13/2023 (Data protection), Decree 158/2024 (E-transactions)
- Research: `plans/reports/researcher-260811-1525-linkeduvn-b2b2c-optimization.json` (Legal structure: EdCo + TechCo split for tax optimization, Luật GD 2027 monitoring)

## Key Insights
1. **LinkEduVN is a COORDINATOR, not provider** — Critical legal distinction
2. **Revenue from services, not tuition** — Avoids education provider regulations
3. **Upcoming Luật GD 2027** — May change licensing for platforms
4. **Data localization** — Decree 13 requires VN data storage
5. **Scholarship fund** — Not legally binding, needs careful structuring

## Risk Register (Research-Informed)

| Risk | Likelihood | Impact | Timeline | Mitigation |
|------|------------|--------|----------|------------|
| **R1: Platform reclassified as education provider** | Medium | Critical | 2025-2027 | Maintain coordinator structure, no tuition collection, clear contracts |
| **R2: Luật GD 2027 requires platform license** | High | High | 2027 | Monitor draft, lobby via VCCI, prepare license application |
| **R3: Decree 13 data localization fine** | Medium | High | Ongoing | PostgreSQL in VN, DPO appointment, quarterly audit |
| **R4: Decree 61/2024 MOA approval delays** | High | Medium | Ongoing | Pre-validate MOAs, template library, legal review SLA |
| **R5: Scholarship fund tax treatment** | Medium | Medium | 2025+ | Separate entity, charitable status, tax advisor |
| **R6: Cross-border data (intl pathways)** | Low | High | 2026+ | Standard contractual clauses, adequacy decisions |
| **R7: Labor law (internship vs employment)** | Medium | High | Ongoing | Clear contracts, insurance, Decree 145/2020 compliance |
| **R8: VAT on SaaS vs education services** | Low | Medium | Ongoing | **Separate EdCo (0% VAT) + TechCo (10% VAT) entities** (Research recommendation) |

## Mitigation Architecture

### Legal Entity Structure (Research Recommendation)
```
LinkEduVN Holding (JSC)
├── LinkEduVN Education JSC (EdCo) — 0% VAT
│   ├── School partnerships
│   ├── MOA management
│   ├── Scholarship fund
│   └── CTĐT coordination
└── LinkEduVN Technology JSC (TechCo) — 10% VAT
    ├── Platform SaaS
    ├── Matching algorithms
    ├── Data analytics
    └── API/integrations
```

**Research Finding**: This split enables tax optimization - EdCo for education services (0% VAT), TechCo for SaaS/platform (10% VAT). Transfer pricing documentation required.

### Compliance Monitoring System

```prisma
model RegulatoryRisk {
  id              String   @id @default(uuid())
  code            String   @unique  // R1, R2, etc.
  title           String
  description     String   @db.Text
  category        RiskCategory // LICENSING | DATA | TAX | LABOR | CONTRACT
  likelihood      Likelihood // LOW | MEDIUM | HIGH
  impact          Impact     // LOW | MEDIUM | HIGH | CRITICAL
  status          RiskStatus // OPEN | MONITORING | MITIGATING | RESOLVED
  owner           String     // Legal/Compliance lead
  nextReviewDate  DateTime   @db.Date
  mitigationPlan  String     @db.Text
  evidence        Json       // Documents, opinions, correspondence
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}

model ComplianceChecklist {
  id              String   @id @default(uuid())
  regulation      String   // e.g., "Decree 61/2024 Art 15"
  requirement     String
  frequency       Frequency // DAILY | WEEKLY | MONTHLY | QUARTERLY | ANNUAL
  responsibleRole String
  evidenceRequired Json
  lastCompleted   DateTime?
  nextDue         DateTime   @db.Date
  status          ChecklistStatus // COMPLIANT | PARTIAL | NON_COMPLIANT | NA
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model LegalDocument {
  id              String   @id @default(uuid())
  entityId        String   // School/Enterprise/Platform
  entityType      Segment
  docType         DocType  // MOA | CONTRACT | NDA | LICENSE | APPROVAL | TAX
  title           String
  fileUrl         String
  signedAt        DateTime?
  expiresAt       DateTime?
  status          DocStatus // DRAFT | PENDING_SIGNATURE | ACTIVE | EXPIRED | ARCHIVED
  metadata        Json
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## Implementation Steps

1. **Add Prisma models** — RegulatoryRisk, ComplianceChecklist, LegalDocument
2. **Create ComplianceService** — Risk register, checklist engine
3. **Build DocumentVault** — Secure storage with audit trail
4. **Implement Alerting** — Upcoming deadlines, regulation changes
5. **Create LegalDashboard** — Real-time compliance status
6. **Seed risk register** — From table above
7. **Seed compliance checklist** — Key regulations with frequencies
8. **Add entity structure** — EdCo/TechCo in School/Enterprise models
9. **Write tests** — Deadline calculations, status transitions

## Files to Modify/Create

### New Files
- `packages/api/prisma/schema.prisma` — Add compliance models
- `packages/api/src/modules/compliance/compliance.service.ts`
- `packages/api/src/modules/compliance/document-vault.service.ts`
- `packages/api/src/modules/compliance/alerting.service.ts`
- `packages/api/src/modules/compliance/compliance.controller.ts`
- `packages/api/src/modules/compliance/compliance.module.ts`
- `packages/api/src/jobs/compliance-monitor.job.ts`
- `packages/api/test/compliance.service.spec.ts`

### Modified Files
- `packages/api/src/modules/schools/schools.service.ts` — Entity type
- `packages/api/src/modules/enterprises/enterprises.service.ts` — Entity type
- `packages/api/src/modules/moas/moas.service.ts` — Compliance checks
- `packages/api/src/modules/invoices/invoices.service.ts` — VAT separation

## Todo List

- [ ] Add Prisma compliance models
- [ ] Run migration
- [ ] Create ComplianceModule
- [ ] Seed regulatory risk register (8+ risks)
- [ ] Seed compliance checklist (20+ items)
- [ ] Build deadline alerting (email/slack)
- [ ] Create legal document vault
- [ ] Implement EdCo/TechCo entity separation
- [ ] Add VAT calculation per entity
- [ ] Build compliance dashboard
- [ ] Quarterly audit report generation
- [ ] Write tests
- [ ] Legal review of entity structure

## Success Criteria
- [ ] All 8 risks tracked with owner, next review date
- [ ] 100% compliance checklist items have responsible role
- [ ] Zero overdue compliance items
- [ ] Document vault search < 1s
- [ ] EdCo/TechCo revenue separation accurate
- [ ] VAT filing automated per entity
- [ ] All tests pass

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Legal structure change delayed | Medium | High | Start with single entity, split at scale |
| Regulation changes outpace monitoring | Medium | Medium | Legal retainer, industry association membership |
| Cross-border complexity | Low | High | Defer intl until domestic stable |

## Next Steps
- Phase 6: Competitive Moats (regulatory compliance as moat)
- Phase 7: Roadmap (prioritize compliance items)