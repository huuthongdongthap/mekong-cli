---
codex-command: "/treasury-position"
source: ".claude/commands/treasury-position.md"
invocation: "mekong treasury-position $ARGUMENTS"
description: "Daily cash position across all accounts"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "c305c5121d4716cebbac421d59adae7a299ab2e86e2f5da5a3d38923063eccd8"
---

# /treasury-position

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong treasury-position $ARGUMENTS
```

## Source Command

# /treasury:position — Cash Position

**IC super command** — Daily cash position across all accounts

## Pipeline

```
SEQUENTIAL: aggregate-accounts → reconcile → dashboard
```

## Trigger

Runs recipe `recipes/treasury/position.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/treasury:position [goal]
```

## Estimated: 2 credits, 5 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
