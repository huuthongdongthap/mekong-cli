---
codex-command: "/sales-proposal"
source: ".claude/commands/sales-proposal.md"
invocation: "mekong sales-proposal $ARGUMENTS"
description: "Sales proposal — client needs analysis, solution design, pricing, ROI calculation. 4 steps, ~25 min."
argument-hint: "[client name and opportunity]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "27104bd544a0f58b83cfdcf3f7eea4f8354da42a776601fab97ed1d0251dc2c5"
---

# /sales-proposal

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sales-proposal $ARGUMENTS
```

## Source Command

# /sales:sales-proposal — Sales Proposal

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── needs-analysis          → client-needs.md
  ├── solution-design         → solution.md
  ├── pricing-structure       → pricing.md
  └── roi-calculation         → proposal.md
```

## Output directory: reports/sales/sales-proposal/
