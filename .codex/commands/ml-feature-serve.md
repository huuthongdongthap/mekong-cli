---
codex-command: "/ml-feature-serve"
source: ".claude/commands/ml-feature-serve.md"
invocation: "mekong ml-feature-serve $ARGUMENTS"
description: "Serve features for real-time inference"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "c9521382fa3d784a4d1622a2d994b919cfba4f88eefd53b82a006efbec4d5aa4"
---

# /ml-feature-serve

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ml-feature-serve $ARGUMENTS
```

## Source Command

# /ml:feature-serve — Feature Serve
**IC super command** — Serve features for real-time inference
## Pipeline
```
SEQUENTIAL: load-features → cache → serve-api
```
## Trigger
Runs recipe `recipes/ml/feature-serve.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/ml:feature-serve [goal]
```
## Estimated: 2 credits, 5 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
