---
codex-command: "/audit-report"
source: ".claude/commands/audit-report.md"
invocation: "mekong audit-report $ARGUMENTS"
description: "Generate audit report from findings — executive summary, detailed findings, risk ratings. 2 steps, ~12 min."
argument-hint: "[audit scope or prior findings file]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "50e6b0005a752faa57f025ff9a1047aff7c9edeed2184094c135f3e6265cb16e"
---

# /audit-report

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong audit-report $ARGUMENTS
```

## Source Command

# /compliance:audit-report — Audit Report Generator

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── findings-analysis       → risk-matrix.md
  └── report-generation       → audit-report.md
```

## Output directory: reports/compliance/audit-report/
