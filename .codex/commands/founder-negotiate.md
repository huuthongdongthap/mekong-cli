---
codex-command: "/founder-negotiate"
source: ".claude/commands/founder-negotiate.md"
invocation: "mekong founder-negotiate $ARGUMENTS"
description: "Analyze term sheet + model dilution + plan negotiation strategy. 4 commands, ~20 min."
argument-hint: "[founder context or goal]"
allowed-tools: "default"
content-sha256: "e39888fd9288968013991e44e3bf12dffc18be4e794847d956f247c72a179f0a"
---

# /founder-negotiate

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong founder-negotiate $ARGUMENTS
```

## Source Command

# Deal Negotiation Kit

> Trigger: `/founder:negotiate $ARGUMENTS`
> Estimated: ~20 min

## Execution

Load recipe: `recipes/founder/negotiate.json`

Run the DAG workflow:

### Analyze Terms (parallel)
- `founder-vc-term-sheet`
- `dilution-sim`

### Counter-Strategy (sequential)
- `founder-vc-cap-table`
- `founder-vc-negotiate`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/negotiation`
5. Report completion with summary
