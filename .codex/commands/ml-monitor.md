---
codex-command: "/ml-monitor"
source: ".claude/commands/ml-monitor.md"
invocation: "mekong ml-monitor $ARGUMENTS"
description: "Drift detection, latency, hallucination rates, cost per inference"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "438aefe8fff2d25286321528370633278a6ce823211b89e890719040db70fb84"
---

# /ml-monitor

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ml-monitor $ARGUMENTS
```

## Source Command

# /ml:monitor — Model Monitor

**IC super command** — Drift detection, latency, hallucination rates, cost per inference

## Pipeline

```
PARALLEL: drift-check + latency-check + hallucination-check + cost-check\n    
```

## Trigger

Runs recipe `recipes/ml/monitor.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/ml:monitor [goal]
```

## Estimated: \nSEQUENTIAL: alert-report credits, 2 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
