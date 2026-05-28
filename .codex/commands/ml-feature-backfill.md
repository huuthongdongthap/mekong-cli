---
codex-command: "/ml-feature-backfill"
source: ".claude/commands/ml-feature-backfill.md"
invocation: "mekong ml-feature-backfill $ARGUMENTS"
description: "Backfill historical features for training"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "f0dbcc3978dbc5deb5e16331b8b70df265b0387663b65aeae10549fb2627ec3d"
---

# /ml-feature-backfill

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ml-feature-backfill $ARGUMENTS
```

## Source Command

# /ml:feature-backfill — Feature Backfill
**IC super command** — Backfill historical features for training
## Pipeline
```
SEQUENTIAL: define-window → compute → store
```
## Trigger
Runs recipe `recipes/ml/feature-backfill.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/ml:feature-backfill [goal]
```
## Estimated: 3 credits, 12 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
