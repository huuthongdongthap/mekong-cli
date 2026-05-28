---
codex-command: "/data-metric"
source: ".claude/commands/data-metric.md"
invocation: "mekong data-metric $ARGUMENTS"
description: "Semantic layer for consistent KPI definitions"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "8133aeb1754284cebeb70d3e038a79b3ef5018a52ab61ad84283c654ac4c7fbc"
---

# /data-metric

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong data-metric $ARGUMENTS
```

## Source Command

# /data:metric — Semantic Layer

**IC super command** — Semantic layer for consistent KPI definitions

## Pipeline

```
SEQUENTIAL: define-metrics → validate-calculations → publish-layer
OUTPUT: reports/data/metric/
```

## Trigger

Runs recipe `recipes/data/metric.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/data:metric [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
