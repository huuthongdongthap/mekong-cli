---
codex-command: "/revops-health"
source: ".claude/commands/revops-health.md"
invocation: "mekong revops-health $ARGUMENTS"
description: "Unified customer health score — CS + sales + usage"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "c0f13483938dc7488526d7309a294972eb60d6b9858f003d2b22e284f4f41297"
---

# /revops-health

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong revops-health $ARGUMENTS
```

## Source Command

# /revops:health — Customer Health

**IC super command** — Unified customer health score — CS + sales + usage

## Pipeline

```
PARALLEL: cs-score + sales-score + usage-score\n    
```

## Trigger

Runs recipe `recipes/revops/health.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/revops:health [goal]
```

## Estimated: \nSEQUENTIAL: unified-health credits, 2 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
