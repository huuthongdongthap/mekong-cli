# Phase 6 — Competitive Moat Strengthening

## Overview
- Priority: Medium
- Status: Pending
- Duration: 2-3 days

## Context Links
- Business model: `docs/business-model-superior.md` lines 15-45
- Legal moats: `docs/legal-compliance-2026.md` lines 20-30
- Network effects: Phase 3
- Research: `plans/reports/researcher-260811-1525-linkeduvn-b2b2c-optimization.json` (VST taxonomy as proprietary data moat, regulatory compliance as moat, alumni network lock-in)

## Key Insights
1. **Current moat = First-mover + Regulatory complexity** — Not sustainable alone
2. **Vietnam-specific advantages** — Language, law, relationships, data
3. **Data network effect** — Strongest long-term moat (matching accuracy)
4. **Switching costs** — MOAs, integrated workflows, alumni network

## Moat Matrix (Research-Informed)

| Moat Type | Current Strength | Target Strength | Investment | Timeline | Research Basis |
|-----------|------------------|-----------------|------------|----------|----------------|
| **Regulatory/Compliance** | Medium (coordinator model) | High (licensed platform) | Legal, lobbying | 12-24 mo | EdCo/TechCo split, Decree 61/2024 template library |
| **Data Network Effect** | Low (early stage) | High (matching IP) | ML, data infra | 18-36 mo | **VST taxonomy compounds with each placement** |
| **Switching Costs** | Medium (MOAs) | High (deep workflow) | Product depth | 12-18 mo | MOA templates, integrated workflows, alumni network |
| **Brand/Trust** | Low (new) | High (placement outcomes) | Marketing, PR | 24-36 mo | Non-provider positioning = trust moat |
| **Relationship/Channel** | Medium (5 schools) | High (50+ schools) | BD team | 24-36 mo | School + Enterprise dual network |
| **Talent/Team** | Medium | High | Hiring, culture | Ongoing | Vietnam-specific expertise |
| **Capital Efficiency** | High (asset-light) | High | Discipline | Ongoing | Platform model, no capex |

## Vietnam-Specific Moats to Build (Research Priority)

### 1. Vietnam Skills Taxonomy (VST) — Proprietary Data Asset (Highest Priority)
- Standardized skill framework mapped to VN QCVN standards
- Every placement enriches taxonomy → better matching
- **Moat**: Becomes industry standard, hard to replicate
- **Research**: "Proprietary data compounding with each placement"

### 2. MOA Template Library & Auto-Compliance
- Pre-approved MOA templates per sector (IT, Logistics, Healthcare, etc.)
- Auto-check against Decree 61/2024, Circular 02/2024
- **Moat**: Reduces legal friction, speeds deals

### 3. Alumni Employer Network
- Track every graduate → employer → re-hire rate
- Enterprise values: "We hire from LinkEduVN pipeline"
- **Moat**: Enterprise lock-in via talent quality

### 4. Government/Industry Data Partnerships
- Official LMI (Labor Market Information) provider
- MOLISA, GSO data sharing agreements
- **Moat**: Exclusive data access, regulatory goodwill

### 5. Scholarship Fund as ESG Channel
- Corporate CSR budget → tax-deductible scholarships
- Brand association: "Company X funds 100 scholars"
- **Moat**: Recurring enterprise revenue + brand moat

## Architecture

### New Models (Prisma additions)
```prisma
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

model MoatMetric {
  id              String   @id @default(uuid())
  date            DateTime @db.Date
  moatType        MoatType // REGULATORY | DATA | SWITCHING | BRAND | CHANNEL | TALENT | CAPITAL
  metricName      String
  value           Float
  target          Float
  trend           Trend    // IMPROVING | STABLE | DECLINING
  notes           String?
  createdAt       DateTime @default(now())
  
  @@unique([date, moatType, metricName])
}
```

## Implementation Steps

1. **Add Prisma models** — SkillTaxonomy, ProgramSkillMap, PlacementSkillMatch, MoatMetric
2. **Create TaxonomyService** — VST management, versioning
3. **Build SkillMappingService** — Program ↔ Skill, Placement ↔ Skill
4. **Create MoatTracker** — Quarterly moat health assessment
5. **Seed initial taxonomy** — 200+ skills across 5 sectors
6. **Build MOA Template Library** — Document automation
7. **Create AlumniTracker** — Graduate → Employer → Re-hire
8. **Build MoatDashboard** — Executive view
9. **Write tests** — Taxonomy hierarchy, mapping accuracy

## Files to Modify/Create

### New Files
- `packages/api/prisma/schema.prisma` — Add moat models
- `packages/api/src/modules/moats/taxonomy.service.ts`
- `packages/api/src/modules/moats/skill-mapping.service.ts`
- `packages/api/src/modules/moats/moa-template.service.ts`
- `packages/api/src/modules/moats/alumni-tracker.service.ts`
- `packages/api/src/modules/moats/moat-tracker.service.ts`
- `packages/api/src/modules/moats/moats.controller.ts`
- `packages/api/src/modules/moats/moats.module.ts`
- `packages/api/src/jobs/moat-assessment.job.ts`
- `packages/api/test/moats.service.spec.ts`

### Modified Files
- `packages/api/src/modules/programs/programs.service.ts` — Skill mapping
- `packages/api/src/modules/placements/placements.service.ts` — Skill gap analysis
- `packages/api/src/modules/moas/moas.service.ts` — Template library
- `packages/web/src/app/(dashboard)/page.tsx` — Moat health widgets

## Todo List

- [ ] Add Prisma moat models
- [ ] Run migration
- [ ] Create MoatsModule
- [ ] Seed VST taxonomy (200+ skills, 5 sectors)
- [ ] Map existing programs to skills
- [ ] Build MOA template library (10+ templates)
- [ ] Implement alumni tracking
- [ ] Create quarterly moat assessment job
- [ ] Build moat dashboard
- [ ] Define moat KPIs per type
- [ ] Write tests
- [ ] Document moat strategy for investors

## Success Criteria
- [ ] VST taxonomy covers >80% of placement roles
- [ ] Skill-match accuracy improves placement conversion >15%
- [ ] MOA time-to-sign < 2 weeks (from 4-6 weeks)
- [ ] Alumni re-hire rate > 25%
- [ ] Moat metrics tracked quarterly with board visibility
- [ ] All tests pass

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Taxonomy scope creep | High | Medium | Start with 5 sectors, strict governance |
| Data quality for skill matching | Medium | High | Human-in-the-loop validation, feedback loop |
| MOA template legal risk | Low | High | Lawyer review gate, version control |

## Next Steps
- Phase 7: Implementation Roadmap (prioritize moat investments by ROI)