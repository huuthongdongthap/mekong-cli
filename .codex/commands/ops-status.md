---
codex-command: "/ops-status"
source: ".claude/commands/ops-status.md"
invocation: "mekong ops-status $ARGUMENTS"
description: "Operations status report — uptime, incidents, SLA compliance, team velocity. 2 steps, ~10 min."
argument-hint: "[time period or team]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "82ffc7ad9ea8dafd9cd766d5600144790fa27b0f4df6f91fc50c80d2590ea462"
---

# /ops-status

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ops-status $ARGUMENTS
```

## Source Command

# /ops:ops-status — Operations Status

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── metrics-gather          → ops-metrics.md
  └── status-report           → ops-status.md
```

## Output directory: reports/ops/ops-status/
