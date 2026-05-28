---
codex-command: "/revops-pipeline"
source: ".claude/commands/revops-pipeline.md"
invocation: "mekong revops-pipeline $ARGUMENTS"
description: "Unified pipeline visibility across sales stages"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "acec901d636d759c6a88fc4edf0a9e2c535d2fc1c12dda7c1ac9995764bd2204"
---

# /revops-pipeline

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong revops-pipeline $ARGUMENTS
```

## Source Command

# /revops:pipeline — Pipeline Visibility

**IC super command** — Unified pipeline visibility across sales stages

## Pipeline

```
SEQUENTIAL: aggregate-stages → clean-data → dashboard
```

## Trigger

Runs recipe `recipes/revops/pipeline.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/revops:pipeline [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
