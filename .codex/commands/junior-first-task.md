---
codex-command: "/junior-first-task"
source: ".claude/commands/junior-first-task.md"
invocation: "mekong junior-first-task $ARGUMENTS"
description: "Junior first task — codebase overview, starter issue, guided implementation in 15 min"
argument-hint: "[task or area of interest]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "4aa998ecd1c1921b0fcf06949f58a254373ac4680fa99a3c13c0ef15547b9689"
---

# /junior-first-task

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong junior-first-task $ARGUMENTS
```

## Source Command

# /junior:first-task — First Task

**IC super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
SEQUENTIAL: /docs-readme → /kanban --good-first-issue           (~8 min)
    |
SEQUENTIAL: /cook --guided                                       (~7 min)
    |
OUTPUT: reports/junior/first-task/
```

## Estimated: 5 credits, 15 minutes

## Execution

Load recipe: `recipes/junior/junior-first-task.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
