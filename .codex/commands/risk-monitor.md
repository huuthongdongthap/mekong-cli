---
codex-command: "/risk-monitor"
source: ".claude/commands/risk-monitor.md"
invocation: "mekong risk-monitor $ARGUMENTS"
description: "Continuous controls monitoring"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "a33d550aad4afa29c02fefa14e6db5b8b5aaee0553e264ae2131d324b74a2c7d"
---

# /risk-monitor

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong risk-monitor $ARGUMENTS
```

## Source Command

# /risk:monitor — Controls Monitoring

**IC super command** — Continuous controls monitoring

## Pipeline

```
SEQUENTIAL: monitor-controls → alert-failures
    |
OUTPUT: reports/risk/monitor/
```

## Trigger

Runs recipe `recipes/risk/monitor.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/risk:monitor [goal]
```

## Estimated: 2 credits, 5 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
