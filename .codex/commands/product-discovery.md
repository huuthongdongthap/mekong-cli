---
codex-command: "/product-discovery"
source: ".claude/commands/product-discovery.md"
invocation: "mekong product-discovery $ARGUMENTS"
description: "Problem → persona → solution → validation. 5 commands, ~30 min."
argument-hint: "[product context or goal]"
allowed-tools: "default"
content-sha256: "e03905976aec301d20402946edb5b30c96eef349a08495843940a2af7d874dbc"
---

# /product-discovery

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong product-discovery $ARGUMENTS
```

## Source Command

# Product Discovery Sprint

> Trigger: `/product:discovery $ARGUMENTS`
> Estimated: ~30 min

## Execution

Load recipe: `recipes/product/discovery.json`

Run the DAG workflow:

### Understand Problem Space (parallel)
- `persona`
- `competitor`
- `brainstorm`

### Define Solution (sequential)
- `scope`
- `estimate`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/discovery`
5. Report completion with summary
