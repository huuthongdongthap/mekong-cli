---
codex-command: "/pm-analytics"
source: ".claude/commands/pm-analytics.md"
invocation: "mekong pm-analytics $ARGUMENTS"
description: "Funnel analysis and feature adoption tracking"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "bff66cdeebe875d9e48de3c94907b6875e990d3faadf89b48878454bc2b0dfac"
---

# /pm-analytics

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-analytics $ARGUMENTS
```

## Source Command

# /pm:analytics — Product Analytics

**IC super command** — Funnel analysis and feature adoption tracking

## Pipeline

```
PARALLEL: funnel-analysis + adoption-tracking\n    
```

## Trigger

Runs recipe `recipes/pm/analytics.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/pm:analytics [goal]
```

## Estimated: \nSEQUENTIAL: insights-report credits, 2 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
