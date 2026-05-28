---
codex-command: "/raas/debug"
source: ".claude/commands/raas/debug.md"
invocation: "mekong raas/debug $ARGUMENTS"
description: "Debug errors and issues. 1 command, ~15-30 min."
argument-hint: "[error description or log]"
allowed-tools: "Read, Grep, Bash, Task"
content-sha256: "8786ceb1304e6085f24eb90b1fee23f717f9efd2132f3dbdf890957c6710b503"
---

# /raas/debug

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong raas/debug $ARGUMENTS
```

## Source Command

# /debug — Debug (Error Investigation)

**Engineering** — single command.

## Estimated: 3 credits, 15-30 minutes

## Workflow

```
[Read Error] → [Trace Logs] → [Identify Root Cause] → [Fix] → [Verify]
```

## Execution

1. Read error logs/traces
2. Grep for error patterns
3. Identify root cause
4. Implement fix
5. Run tests to verify
6. Report findings

## Goal context

<goal>$ARGUMENTS</goal>
