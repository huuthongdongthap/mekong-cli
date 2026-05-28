---
codex-command: "/product-retrospective"
source: ".claude/commands/product-retrospective.md"
invocation: "mekong product-retrospective $ARGUMENTS"
description: "Review sprint → gather feedback → improvement plan → next sprint prep. 3 commands, ~15 min."
argument-hint: "[product context or goal]"
allowed-tools: "default"
content-sha256: "cebf022b176b61a0bc3df218bc6a69a6527cd151df2fb709bef83daaa2fc8f47"
---

# /product-retrospective

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong product-retrospective $ARGUMENTS
```

## Source Command

# Sprint Retrospective

> Trigger: `/product:retrospective $ARGUMENTS`
> Estimated: ~15 min

## Execution

Load recipe: `recipes/product/retrospective.json`

Run the DAG workflow:

### Review Performance (parallel)
- `retrospective`
- `feedback`

### Improvement Plan (sequential)
- `standup`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/retro`
5. Report completion with summary
