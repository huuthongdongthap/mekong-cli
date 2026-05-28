---
codex-command: "/sales-pipeline"
source: ".claude/commands/sales-pipeline.md"
invocation: "mekong sales-pipeline $ARGUMENTS"
description: "Sales pipeline build — lead qualification, stage definition, scoring, CRM structure. 3 steps, ~20 min."
argument-hint: "[product or market segment]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "eb9c0ea7d42049932878511c53c73e9344e922ef6b81174025cdc8e976892e37"
---

# /sales-pipeline

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sales-pipeline $ARGUMENTS
```

## Source Command

# /sales:sales-pipeline — Sales Pipeline Builder

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── lead-qualification      → icp-criteria.md
  ├── stage-definition        → pipeline-stages.md
  └── scoring-model           → lead-scoring.md
```

## Output directory: reports/sales/sales-pipeline/
