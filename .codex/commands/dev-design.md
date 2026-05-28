---
codex-command: "/dev-design"
source: ".claude/commands/dev-design.md"
invocation: "mekong dev-design $ARGUMENTS"
description: "Dev design command. Delegates to worker level."
argument-hint: "[feature or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "fa945b46bcb658cf5463ed9d0b791298160fe91223c52799e282437387990018"
---

# /dev-design

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong dev-design $ARGUMENTS
```

## Source Command

# /dev:design — Developer Level

**Developer execution command** — code generation and quality.

## Pipeline

DELEGATION: dev:design → worker:*
OUTPUT: reports/dev/design/

## Execution

Load recipe: recipes/dev/design.json

Execute DAG groups in dependency order.

## Goal context

<goal>$ARGUMENTS</goal>
