---
codex-command: "/board-report"
source: ".claude/commands/board-report.md"
invocation: "mekong board-report $ARGUMENTS"
description: "Board meeting report — KPIs, financial summary, strategic updates, risk register. 4 steps, ~30 min."
argument-hint: "[quarter or meeting date]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "45ad0da84010a78f21edbd548a0d168f93de7981b66353732d8412bf3a67e873"
---

# /board-report

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong board-report $ARGUMENTS
```

## Source Command

# /venture:board-report — Board Report

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── kpi-extraction          → kpi-dashboard.md
  ├── financial-summary       → financials.md
  ├── strategic-update        → strategy-update.md
  └── risk-register           → risk-summary.md
```

## Output directory: reports/venture/board-report/
