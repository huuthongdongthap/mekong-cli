---
codex-command: "/founder-raise"
source: ".claude/commands/founder-raise.md"
invocation: "mekong founder-raise $ARGUMENTS"
description: "Complete fundraise preparation — from unit economics to investor targeting. 8 commands, ~45 min."
argument-hint: "[founder context or goal]"
allowed-tools: "default"
content-sha256: "0fe7054d8c1434b278f8ef2e212d64766fd667b7ca2b96490715188a2c78591f"
---

# /founder-raise

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong founder-raise $ARGUMENTS
```

## Source Command

# Fundraise Pipeline

> Trigger: `/founder:raise $ARGUMENTS`
> Estimated: ~45 min

## Execution

Load recipe: `recipes/founder/raise.json`

Run the DAG workflow:

### Validate Fundamentals (parallel)
- `unit-economics`
- `tam`
- `moat-audit`

### Prepare Materials (parallel)
- `financial-model`
- `data-room`

### Position & Target (sequential)
- `founder-vc-cap-table`
- `founder-pitch`
- `founder-vc-map`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/raise-ready-kit`
5. Report completion with summary
