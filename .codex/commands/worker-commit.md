---
codex-command: "/worker-commit"
source: ".claude/commands/worker-commit.md"
invocation: "mekong worker-commit $ARGUMENTS"
description: "Stage, validate, and commit changes with conventional message"
argument-hint: "[scope] [message]"
allowed-tools: "default"
content-sha256: "c8feac2e163492e844661e78fa671a673478f28f7766b929913d9d31cd27ecf5"
---

# /worker-commit

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong worker-commit $ARGUMENTS
```

## Source Command

# /worker-commit — Worker Operation

Create a clean commit.

1. `git diff` review changes
2. Stage relevant files (never `git add -A`)
3. Conventional commit: feat/fix/refactor/docs
4. Verify no secrets committed
