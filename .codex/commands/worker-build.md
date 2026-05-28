---
codex-command: "/worker-build"
source: ".claude/commands/worker-build.md"
invocation: "mekong worker-build $ARGUMENTS"
description: "Worker compile atomic command. 1 credit."
argument-hint: "[target or args]"
allowed-tools: "Read, Write, Bash"
content-sha256: "2a22ff83acfc01ef0b40bfdb9f8eebac80021bc5062603a5c86462baeb5d7ab0"
---

# /worker-build

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong worker-build $ARGUMENTS
```

## Source Command

# /worker:build — Atomic Compile & Bundle

**Atomic command** — executes directly, no delegation. Leaf node in ROIaaS hierarchy.

## Execution

Direct execution — no recipe loading. Single atomic operation.

1. Parse arguments from goal context
2. Execute the compile/bundle operation directly
3. Report results

## Goal context

<goal>$ARGUMENTS</goal>
