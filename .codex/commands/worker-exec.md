---
codex-command: "/worker-exec"
source: ".claude/commands/worker-exec.md"
invocation: "mekong worker-exec $ARGUMENTS"
description: "Execute a shell command safely with timeout and error handling"
argument-hint: "[command]"
allowed-tools: "default"
content-sha256: "7c4a2ef0362eeef13d3b86a2baf26b4d40203e8b7e231d07f5e4b9ac7f76bfd8"
---

# /worker-exec

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong worker-exec $ARGUMENTS
```

## Source Command

# /worker-exec — Worker Operation

Run a shell command with safety guards.

1. Validate command is safe (no rm -rf, no force operations)
2. Execute with timeout
3. Capture and report output
4. Handle errors gracefully
