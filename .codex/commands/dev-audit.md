---
codex-command: "/dev-audit"
source: ".claude/commands/dev-audit.md"
invocation: "mekong dev-audit $ARGUMENTS"
description: "Dev audit command. Delegates to worker level."
argument-hint: "[feature or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "94a490da5b15355bebffa04649020ee3df5d160cf95b11936c03bb73dc2fbb35"
---

# /dev-audit

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong dev-audit $ARGUMENTS
```

## Source Command

# /dev:audit — Developer Level

**Developer execution command** — code generation and quality.

## Pipeline

DELEGATION: dev:audit → worker:*
OUTPUT: reports/dev/audit/

## Execution

Load recipe: recipes/dev/audit.json

Execute DAG groups in dependency order.

## Goal context

<goal>$ARGUMENTS</goal>
