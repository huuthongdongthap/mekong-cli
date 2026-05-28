---
codex-command: "/finops-budget"
source: ".claude/commands/finops-budget.md"
invocation: "mekong finops-budget $ARGUMENTS"
description: "Cost alerts and approval workflows"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "e34faec6f179e4694ba30147ee210db51a2e74c2342c8808b63a82dd305c0f00"
---

# /finops-budget

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong finops-budget $ARGUMENTS
```

## Source Command

# /finops:budget — Cloud Budget

**IC super command** — Cost alerts and approval workflows

## Pipeline

```
SEQUENTIAL: set-budgets → configure-alerts → approval-flow
```

## Trigger

Runs recipe `recipes/finops/budget.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/finops:budget [goal]
```

## Estimated: 2 credits, 5 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
