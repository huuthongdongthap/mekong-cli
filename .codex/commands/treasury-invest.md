---
codex-command: "/treasury-invest"
source: ".claude/commands/treasury-invest.md"
invocation: "mekong treasury-invest $ARGUMENTS"
description: "Short-term investment policy management"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "bf98774abfe0d4ce7b960458d7e58b9ed1c667651580fa87bf9dd59debf45e98"
---

# /treasury-invest

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong treasury-invest $ARGUMENTS
```

## Source Command

# /treasury:invest — Investment Policy

**IC super command** — Short-term investment policy management

## Pipeline

```
SEQUENTIAL: review-policy → assess-options → allocate
```

## Trigger

Runs recipe `recipes/treasury/invest.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/treasury:invest [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
