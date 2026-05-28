---
codex-command: "/treasury-forecast"
source: ".claude/commands/treasury-forecast.md"
invocation: "mekong treasury-forecast $ARGUMENTS"
description: "13-week rolling cash forecast"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "04a0618cfb38d9eb025da8fb91a2f57ce862a85413ab3ac0210ebbe1858c5ffd"
---

# /treasury-forecast

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong treasury-forecast $ARGUMENTS
```

## Source Command

# /treasury:forecast — Cash Forecast

**IC super command** — 13-week rolling cash forecast

## Pipeline

```
SEQUENTIAL: pull-actuals → project-inflows → project-outflows → model
```

## Trigger

Runs recipe `recipes/treasury/forecast.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/treasury:forecast [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
