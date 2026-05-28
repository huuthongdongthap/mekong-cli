---
codex-command: "/ops-sync-all"
source: ".claude/commands/ops-sync-all.md"
invocation: "mekong ops-sync-all $ARGUMENTS"
description: "Sync everything in parallel — agents, skills, MCP, artifacts, rules. 6 commands, ~10 min."
argument-hint: "[ops context or goal]"
allowed-tools: "default"
content-sha256: "c0519f06bc001771842a51d79d1fcd03bb1eafd53e1ec54209ca0b868dbf4a3c"
---

# /ops-sync-all

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ops-sync-all $ARGUMENTS
```

## Source Command

# Full System Sync

> Trigger: `/ops:sync-all $ARGUMENTS`
> Estimated: ~10 min

## Execution

Load recipe: `recipes/ops/sync-all.json`

Run the DAG workflow:

### Parallel Sync (parallel)
- `sync-agent`
- `sync-providers`
- `sync-mcp`
- `sync-artifacts`
- `sync-rules`
- `sync-tasks`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/sync`
5. Report completion with summary
