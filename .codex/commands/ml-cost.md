---
codex-command: "/ml-cost"
source: ".claude/commands/ml-cost.md"
invocation: "mekong ml-cost $ARGUMENTS"
description: "Per-request cost tracking and budget alerting"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "02174bf21f40b0c20c32f965322d510da751be767f60de9c2ed94a7354f32716"
---

# /ml-cost

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ml-cost $ARGUMENTS
```

## Source Command

# /ml:cost — Inference Cost

**IC super command** — Per-request cost tracking and budget alerting

## Pipeline

```
SEQUENTIAL: collect-usage → allocate-costs → set-alerts
```

## Trigger

Runs recipe `recipes/ml/cost.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/ml:cost [goal]
```

## Estimated: 2 credits, 5 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
