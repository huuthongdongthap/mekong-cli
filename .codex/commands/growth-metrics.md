---
codex-command: "/growth-metrics"
source: ".claude/commands/growth-metrics.md"
invocation: "mekong growth-metrics $ARGUMENTS"
description: "Growth metrics dashboard — acquisition, activation, retention, revenue, referral. 2 steps, ~12 min."
argument-hint: "[product or time period]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "8c360e864587ab651ba5bec905fcb3a112d8487673fb10b7295a7b0d4048cd28"
---

# /growth-metrics

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong growth-metrics $ARGUMENTS
```

## Source Command

# /growth:growth-metrics — Growth Metrics

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── metrics-collection      → raw-metrics.md
  └── dashboard-assembly      → growth-dashboard.md
```

## Output directory: reports/growth/growth-metrics/
