---
codex-command: "/dev-debug"
source: ".claude/commands/dev-debug.md"
invocation: "mekong dev-debug $ARGUMENTS"
description: "Dev debug command. Delegates to worker level."
argument-hint: "[feature or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "c0ebedefe437249c975e06799d3b4b9ce477ec11f62aff6c591d6973f0f93325"
---

# /dev-debug

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong dev-debug $ARGUMENTS
```

## Source Command

# /dev:debug — Developer Level

**Developer execution command** — code generation and quality.

## Pipeline

DELEGATION: dev:debug → worker:*
OUTPUT: reports/dev/debug/

## Execution

Load recipe: recipes/dev/debug.json

Execute DAG groups in dependency order.

## Goal context

<goal>$ARGUMENTS</goal>
