---
codex-command: "/dev-review"
source: ".claude/commands/dev-review.md"
invocation: "mekong dev-review $ARGUMENTS"
description: "Dev review command. Delegates to worker level."
argument-hint: "[feature or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "28a2548800f5d33801297e68c6214dca9c195aab2b011b8d03360073190ef06f"
---

# /dev-review

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong dev-review $ARGUMENTS
```

## Source Command

# /dev:review — Developer Level

**Developer execution command** — code generation and quality.

## Pipeline

DELEGATION: dev:review → worker:*
OUTPUT: reports/dev/review/

## Execution

Load recipe: recipes/dev/review.json

Execute DAG groups in dependency order.

## Goal context

<goal>$ARGUMENTS</goal>
