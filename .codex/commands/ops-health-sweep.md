---
codex-command: "/ops-health-sweep"
source: ".claude/commands/ops-health-sweep.md"
invocation: "mekong ops-health-sweep $ARGUMENTS"
description: "System-wide health audit — services, security, performance, sync status. 5 commands, ~15 min."
argument-hint: "[ops context or goal]"
allowed-tools: "default"
content-sha256: "f15ed0b583e5b51426e3ead389440d8e17a5412d47e25d30ddc8d09dbc9d21b4"
---

# /ops-health-sweep

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ops-health-sweep $ARGUMENTS
```

## Source Command

# Full Health Sweep

> Trigger: `/ops:health-sweep $ARGUMENTS`
> Estimated: ~15 min

## Execution

Load recipe: `recipes/ops/health-sweep.json`

Run the DAG workflow:

### Full System Scan (parallel)
- `health`
- `security`
- `benchmark`
- `status`

### Compiled Report (sequential)
- `report`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/health-sweep`
5. Report completion with summary
