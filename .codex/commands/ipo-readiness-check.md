---
codex-command: "/ipo-readiness-check"
source: ".claude/commands/ipo-readiness-check.md"
invocation: "mekong ipo-readiness-check $ARGUMENTS"
description: "IPO readiness — SOX cycle, investor metrics, disclosure check, then S-1 narrative"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "24c4247782b7a2df66cca62685c09117cb68aba95a368da878a83b1d98cf41de"
---

# /ipo-readiness-check

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ipo-readiness-check $ARGUMENTS
```

## Source Command

# /ipo:readiness-check — IPO Readiness Check

**Super command** — chains multiple commands via DAG pipeline.

## Pipeline

```
PARALLEL: /compliance:sox-cycle + /ir:metrics + /governance:disclosure
    |
SEQUENTIAL: /ir:narrative
    |
OUTPUT: reports/ipo/readiness-check/
```

## Trigger

Runs recipe `recipes/ipo/readiness-check.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Spawn parallel subagents via Task tool
3. Wait for all groups to complete
4. Compile into summary report

## Usage

```
/ipo:readiness-check [goal]
```

## Estimated: 27 credits, 45 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
