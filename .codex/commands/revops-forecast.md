---
codex-command: "/revops-forecast"
source: ".claude/commands/revops-forecast.md"
invocation: "mekong revops-forecast $ARGUMENTS"
description: "Pipeline-weighted forecast and scenario modeling"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "84d7629b79ad1b43275fe7a2682b394309bb3eaa34f675f0fe8306e79050ad4a"
---

# /revops-forecast

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong revops-forecast $ARGUMENTS
```

## Source Command

# /revops:forecast — Revenue Forecast

**IC super command** — Pipeline-weighted forecast and scenario modeling

## Pipeline

```
SEQUENTIAL: pull-pipeline → weight-stages → model-scenarios → report
```

## Trigger

Runs recipe `recipes/revops/forecast.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/revops:forecast [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
