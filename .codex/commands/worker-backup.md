---
codex-command: "/worker-backup"
source: ".claude/commands/worker-backup.md"
invocation: "mekong worker-backup $ARGUMENTS"
description: "Backup project state: git stash, export configs, snapshot data"
argument-hint: "[project-name]"
allowed-tools: "default"
content-sha256: "7662aa029fa2b34083bca93ac3977a11da227d267c3cfd8919d9d28fd2cd80ec"
---

# /worker-backup

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong worker-backup $ARGUMENTS
```

## Source Command

# /worker-backup — Worker Operation

Backup current project state before risky operations.

1. `git stash` uncommitted changes
2. Export critical configs
3. Create timestamped backup in `.mekong/backups/`
