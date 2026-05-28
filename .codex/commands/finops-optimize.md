---
codex-command: "/finops-optimize"
source: ".claude/commands/finops-optimize.md"
invocation: "mekong finops-optimize $ARGUMENTS"
description: "Reserved instance management and rightsizing"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "9e5ef1e397784eb86c82d0fa971b8c130b104d44e972a2bb41d16828156db13e"
---

# /finops-optimize

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong finops-optimize $ARGUMENTS
```

## Source Command

# /finops:optimize — Cloud Optimize

**IC super command** — Reserved instance management and rightsizing

## Pipeline

```
PARALLEL: ri-analysis + rightsizing-scan\n    |\nSEQUENTIAL: recommendations
```

## Trigger

Runs recipe `recipes/finops/optimize.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/finops:optimize [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
