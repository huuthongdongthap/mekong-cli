---
codex-command: "/worker-log"
source: ".claude/commands/worker-log.md"
invocation: "mekong worker-log $ARGUMENTS"
description: "View and analyze recent logs for debugging"
argument-hint: "[log-source] [--lines N]"
allowed-tools: "default"
content-sha256: "4153e9f5b6e719b95e7265fc33ab1326981a6b2d9f9d0fe85c7df47a7b81b642"
---

# /worker-log

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong worker-log $ARGUMENTS
```

## Source Command

# /worker-log — Worker Operation

Analyze logs for issues.

1. Read last N lines from log source
2. Filter for errors/warnings
3. Identify patterns
4. Suggest fixes
