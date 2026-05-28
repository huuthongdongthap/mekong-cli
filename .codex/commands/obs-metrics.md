---
codex-command: "/obs-metrics"
source: ".claude/commands/obs-metrics.md"
invocation: "mekong obs-metrics $ARGUMENTS"
description: "Metrics collection, dashboards, and alerting"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "9551c734b429e644670c508fc2fc84d4a5d02f91e26b48543dc7f950ecdc4c9c"
---

# /obs-metrics

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong obs-metrics $ARGUMENTS
```

## Source Command

# /obs:metrics — Metrics Dashboard
**IC super command** — Metrics collection, dashboards, and alerting
## Pipeline
```
SEQUENTIAL: collect-metrics → build-dashboard → configure-alerts
```
## Trigger
Runs recipe `recipes/obs/metrics.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/obs:metrics [goal]
```
## Estimated: 2 credits, 8 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
