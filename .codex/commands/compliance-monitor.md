---
codex-command: "/compliance-monitor"
source: ".claude/commands/compliance-monitor.md"
invocation: "mekong compliance-monitor $ARGUMENTS"
description: "Continuous compliance monitoring — drift detection, policy violations, alert rules. 2 steps, ~10 min."
argument-hint: "[system or compliance domain]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "233d9e3b9791530563728358dd8e3840f38dc118181343023389d2a892348eb3"
---

# /compliance-monitor

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong compliance-monitor $ARGUMENTS
```

## Source Command

# /compliance:compliance-monitor — Compliance Monitor

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── drift-detection         → drift-report.md
  └── alert-configuration     → monitor-rules.md
```

## Output directory: reports/compliance/compliance-monitor/
