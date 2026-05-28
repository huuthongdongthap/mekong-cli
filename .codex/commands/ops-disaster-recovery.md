---
codex-command: "/ops-disaster-recovery"
source: ".claude/commands/ops-disaster-recovery.md"
invocation: "mekong ops-disaster-recovery $ARGUMENTS"
description: "Backup → test restore → verify integrity → document. 3 commands, ~15 min."
argument-hint: "[ops context or goal]"
allowed-tools: "default"
content-sha256: "6ef5b1224465dd3d78e1e5b01802ae61d01fb544e466693c8456c6e8cb38895e"
---

# /ops-disaster-recovery

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ops-disaster-recovery $ARGUMENTS
```

## Source Command

# Disaster Recovery Test

> Trigger: `/ops:disaster-recovery $ARGUMENTS`
> Estimated: ~15 min

## Execution

Load recipe: `recipes/ops/disaster-recovery.json`

Run the DAG workflow:

### Backup & Verify (sequential)
- `health`

### Restore Test (sequential)
- `smoke`
- `report`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/disaster-recovery`
5. Report completion with summary
