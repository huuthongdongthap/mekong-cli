---
codex-command: "/product-sprint-plan"
source: ".claude/commands/product-sprint-plan.md"
invocation: "mekong product-sprint-plan $ARGUMENTS"
description: "Backlog grooming → sprint scope → task breakdown → assignments. 4 commands, ~20 min."
argument-hint: "[product context or goal]"
allowed-tools: "default"
content-sha256: "a86c19d1da9b388dd2672768023b2c231bb4bbd4ae94673b786140647738cfe6"
---

# /product-sprint-plan

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong product-sprint-plan $ARGUMENTS
```

## Source Command

# Sprint Planning

> Trigger: `/product:sprint-plan $ARGUMENTS`
> Estimated: ~20 min

## Execution

Load recipe: `recipes/product/sprint-plan.json`

Run the DAG workflow:

### Backlog Grooming (parallel)
- `feedback`
- `roadmap`

### Sprint Definition (sequential)
- `sprint`
- `estimate`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/sprint`
5. Report completion with summary
