---
codex-command: "/backend-db-task"
source: ".claude/commands/backend-db-task.md"
invocation: "mekong backend-db-task $ARGUMENTS"
description: "Backend DB task — schema change, migration, seed, verify in 10 min"
argument-hint: "[schema change or migration description]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "f21b9a722d67a6c46a2556d2078e362bb453770411dbb3742170e947783a0cb8"
---

# /backend-db-task

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong backend-db-task $ARGUMENTS
```

## Source Command

# /backend:db-task — DB Task

**IC super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
SEQUENTIAL: /migrate → /seed → /test --db                       (~10 min)
    |
OUTPUT: reports/backend/db-task/
```

## Estimated: 5 credits, 10 minutes

## Execution

Load recipe: `recipes/backend/backend-db-task.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
