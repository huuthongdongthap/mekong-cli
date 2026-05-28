---
codex-command: "/business-financial-close"
source: ".claude/commands/business-financial-close.md"
invocation: "mekong business-financial-close $ARGUMENTS"
description: "Monthly/quarterly close — reconcile, report, forecast, tax prep. 5 commands, ~25 min."
argument-hint: "[business context or goal]"
allowed-tools: "default"
content-sha256: "a822ab26b2df14c7b31d7f060f16e9c7166f10d542c05ca9ebbd3692ff92d1e7"
---

# /business-financial-close

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong business-financial-close $ARGUMENTS
```

## Source Command

# Financial Close

> Trigger: `/business:financial-close $ARGUMENTS`
> Estimated: ~25 min

## Execution

Load recipe: `recipes/business/financial-close.json`

Run the DAG workflow:

### Reconciliation (parallel)
- `revenue`
- `expense`
- `invoice`

### Financial Statements (sequential)
- `financial-report`
- `tax`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/financial-close`
5. Report completion with summary
