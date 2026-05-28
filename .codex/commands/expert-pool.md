---
codex-command: "/expert-pool"
source: ".claude/commands/expert-pool.md"
invocation: "mekong expert-pool $ARGUMENTS"
description: "View and manage expert pool — list, filter, stats. 1 command, ~3 min."
argument-hint: "[--specialty=devops --active --setup]"
allowed-tools: "Bash"
content-sha256: "b9fbd4fb04b5f716bf34420331546fafc802a139b8fc51eab107ce95efb6eae1"
---

# /expert-pool

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong expert-pool $ARGUMENTS
```

## Source Command

# /expert:pool — Expert Pool Management

## Engine command

```bash
mekong expert pool
```

## Fallback

If engine not ready, run `mekong --help` to check installation, then retry.

## Goal context

<goal>$ARGUMENTS</goal>
