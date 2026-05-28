---
codex-command: "/founder-validate"
source: ".claude/commands/founder-validate.md"
invocation: "mekong founder-validate $ARGUMENTS"
description: "Validate business model before spending money — PMF, economics, market, moat. 5 commands, ~25 min."
argument-hint: "[founder context or goal]"
allowed-tools: "default"
content-sha256: "93a1a4ac78a6ee022bd367c91b05b9ff6b2f35e59b10f36c3c00262bd524ebd2"
---

# /founder-validate

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong founder-validate $ARGUMENTS
```

## Source Command

# Business Validation Sprint

> Trigger: `/founder:validate-sprint $ARGUMENTS`
> Estimated: ~25 min

## Execution

Load recipe: `recipes/founder/validate.json`

Run the DAG workflow:

### Market & Customer Research (parallel)
- `founder-validate`
- `tam`
- `swot`

### Economic Viability (parallel)
- `unit-economics`
- `moat-audit`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/validation`
5. Report completion with summary
