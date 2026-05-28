---
codex-command: "/business-report"
source: ".claude/commands/business-report.md"
invocation: "mekong business-report $ARGUMENTS"
description: "Business performance report — revenue, growth, operational metrics, recommendations. 3 steps, ~20 min."
argument-hint: "[period or business unit]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "3e1b937393884c4c88297421b042bb382c4b5c085d8e71311c63e87495cac62e"
---

# /business-report

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong business-report $ARGUMENTS
```

## Source Command

# /analytics:business-report — Business Performance Report

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── data-collection         → raw-metrics.md
  ├── analysis                → insights.md
  └── report-assembly         → business-report.md
```

## Output directory: reports/analytics/business-report/
