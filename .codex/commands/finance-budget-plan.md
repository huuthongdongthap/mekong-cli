---
codex-command: "/finance-budget-plan"
source: ".claude/commands/finance-budget-plan.md"
invocation: "mekong finance-budget-plan $ARGUMENTS"
description: "Department budgets, financial forecast, budget allocation and approval deck. 3 commands, ~20 min."
argument-hint: "[fiscal year or quarter]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "81d6f4078bc84db81fb31d1cd8f11c737b5bdbe4de36dee2e33fe00a8ce9eb69"
---

# /finance-budget-plan

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong finance-budget-plan $ARGUMENTS
```

## Source Command

# /finance:budget-plan — Budget Planning

**Super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
PARALLEL: /budget + /forecast                  (~10 min)
    |
SEQUENTIAL: /finance                           (~10 min)
    |
OUTPUT: reports/finance/budget/
```

## Estimated: 12 credits, 20 minutes

## Execution

Load recipe: `recipes/finance/budget-plan.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
