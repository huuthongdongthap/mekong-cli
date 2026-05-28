---
codex-command: "/dev-refactor"
source: ".claude/commands/dev-refactor.md"
invocation: "mekong dev-refactor $ARGUMENTS"
description: "Dev refactor command. Delegates to worker level."
argument-hint: "[feature or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "279ac84c0c654db30b708df6e2efc41fa3af39d9ecf82f53ea6157ac83073567"
---

# /dev-refactor

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong dev-refactor $ARGUMENTS
```

## Source Command

# /dev:refactor — Developer Level

**Developer execution command** — code generation and quality.

## Pipeline

DELEGATION: dev:refactor → worker:*
OUTPUT: reports/dev/refactor/

## Execution

Load recipe: recipes/dev/refactor.json

Execute DAG groups in dependency order.

## Goal context

<goal>$ARGUMENTS</goal>
