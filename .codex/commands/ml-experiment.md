---
codex-command: "/ml-experiment"
source: ".claude/commands/ml-experiment.md"
invocation: "mekong ml-experiment $ARGUMENTS"
description: "Experiment tracking and model versioning"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "3f4543815073b0b44b0f9aed7dbbe3e76009eae55467ae041cd2d4216b3d88d8"
---

# /ml-experiment

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ml-experiment $ARGUMENTS
```

## Source Command

# /ml:experiment — ML Experiment

**IC super command** — Experiment tracking and model versioning

## Pipeline

```
SEQUENTIAL: setup-tracking → log-run → compare-models
```

## Trigger

Runs recipe `recipes/ml/experiment.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/ml:experiment [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
