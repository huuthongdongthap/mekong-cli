---
codex-command: "/worker-rollback"
source: ".claude/commands/worker-rollback.md"
invocation: "mekong worker-rollback $ARGUMENTS"
description: "Rollback to previous known-good state"
argument-hint: "[commit-hash or steps]"
allowed-tools: "default"
content-sha256: "f42e145db567eec8bb57127859b20e5aa6b299fb0b6e8beedb8ef9608bd0d843"
---

# /worker-rollback

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong worker-rollback $ARGUMENTS
```

## Source Command

# /worker-rollback — Worker Operation

Safely rollback changes.

1. Identify rollback target
2. Create backup of current state
3. `git revert` or `git reset` (prefer revert)
4. Verify build passes after rollback
