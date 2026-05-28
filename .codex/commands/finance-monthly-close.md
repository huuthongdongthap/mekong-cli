---
codex-command: "/finance-monthly-close"
source: ".claude/commands/finance-monthly-close.md"
invocation: "mekong finance-monthly-close $ARGUMENTS"
description: "Revenue reconcile, expense audit, P&L statement, cash flow, AR aging. 5 commands, ~25 min."
argument-hint: "[month or period to close]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "07a62e4c99ff75edf38605a578e347e6392627702755b24693c8db9001705d74"
---

# /finance-monthly-close

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong finance-monthly-close $ARGUMENTS
```

## Source Command

# /finance:monthly-close — Monthly Financial Close

**Super command** — chains 5 commands via DAG pipeline.

## Pipeline

```
PARALLEL: /revenue + /expense + /invoice --aging   (~10 min)
    |
SEQUENTIAL: /cashflow → /financial-report           (~15 min)
    |
OUTPUT: reports/finance/monthly-close/
```

## Estimated: 18 credits, 25 minutes

## Execution

Load recipe: `recipes/finance/monthly-close.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
