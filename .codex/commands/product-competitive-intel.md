---
codex-command: "/product-competitive-intel"
source: ".claude/commands/product-competitive-intel.md"
invocation: "mekong product-competitive-intel $ARGUMENTS"
description: "Market scan + competitor deep dive + positioning strategy. 4 commands, ~25 min."
argument-hint: "[product context or goal]"
allowed-tools: "default"
content-sha256: "01cc18654367cdc52d87b3c06df25b03795ac0ddc40c77de87e1854b8d39cbba"
---

# /product-competitive-intel

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong product-competitive-intel $ARGUMENTS
```

## Source Command

# Competitive Intelligence

> Trigger: `/product:competitive-intel $ARGUMENTS`
> Estimated: ~25 min

## Execution

Load recipe: `recipes/product/competitive-intel.json`

Run the DAG workflow:

### Market Scan (parallel)
- `competitor`
- `market-analysis`

### Positioning (sequential)
- `pricing`
- `swot`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/competitive-intel`
5. Report completion with summary
