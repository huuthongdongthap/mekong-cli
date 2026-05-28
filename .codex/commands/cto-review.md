---
codex-command: "/cto-review"
source: ".claude/commands/cto-review.md"
invocation: "mekong cto-review $ARGUMENTS"
description: "Full project health review. 5 credits, ~20 min."
argument-hint: "[project or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "c5a94efbca6371aa8e571c26ead7d6c389a3837c0b304a0aa464fd5a46924eb1"
---

# /cto-review

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cto-review $ARGUMENTS
```

## Source Command

# /cto:review — Project Health Review

**CTO strategic command** — architecture and team orchestration.

## Pipeline

```
DELEGATION: cto:review → pm:* / dev:* → worker:*
OUTPUT: reports/cto/review/
```

## Estimated: 5 credits, ~20 minutes

## Execution

Load recipe: `recipes/cto/review.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
