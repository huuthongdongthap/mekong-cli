---
codex-command: "/ml-retrain"
source: ".claude/commands/ml-retrain.md"
invocation: "mekong ml-retrain $ARGUMENTS"
description: "Automated retraining triggers"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "981ead40d87ddb3699285ea03332ceab3c89bcb12058428961005132bbf9c017"
---

# /ml-retrain

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ml-retrain $ARGUMENTS
```

## Source Command

# /ml:retrain — Auto Retrain

**IC super command** — Automated retraining triggers

## Pipeline

```
SEQUENTIAL: check-triggers → prepare-data → retrain → validate
```

## Trigger

Runs recipe `recipes/ml/retrain.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/ml:retrain [goal]
```

## Estimated: 3 credits, 12 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
