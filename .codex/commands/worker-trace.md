---
codex-command: "/worker-trace"
source: ".claude/commands/worker-trace.md"
invocation: "mekong worker-trace $ARGUMENTS"
description: "Trace execution flow for debugging complex issues"
argument-hint: "[entry-point] [issue-description]"
allowed-tools: "default"
content-sha256: "b355b4c9b1437704a002f191b660fa693af2852609012b11c839a18b0ec0f58e"
---

# /worker-trace

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong worker-trace $ARGUMENTS
```

## Source Command

# /worker-trace — Worker Operation

Debug by tracing execution.

1. Identify entry point
2. Follow call chain
3. Log intermediate values
4. Identify root cause
