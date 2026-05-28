---
codex-command: "/dev-scaffold"
source: ".claude/commands/dev-scaffold.md"
invocation: "mekong dev-scaffold $ARGUMENTS"
description: "Dev scaffold command. Delegates to worker level."
argument-hint: "[feature or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "271c89a23ad784fe4ac60c2a550e81353605df3a692fff0be97913332af8290a"
---

# /dev-scaffold

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong dev-scaffold $ARGUMENTS
```

## Source Command

# /dev:scaffold — Developer Level

**Developer execution command** — code generation and quality.

## Pipeline

DELEGATION: dev:scaffold → worker:*
OUTPUT: reports/dev/scaffold/

## Execution

Load recipe: recipes/dev/scaffold.json

Execute DAG groups in dependency order.

## Goal context

<goal>$ARGUMENTS</goal>
