---
codex-command: "/pm-milestone"
source: ".claude/commands/pm-milestone.md"
invocation: "mekong pm-milestone $ARGUMENTS"
description: "Milestone tracking and status. 2 credits, ~5 min."
argument-hint: "[task or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "1db1651208709b522ee20d0569c714bda196266ec76e3d539cdae76ff1e59283"
---

# /pm-milestone

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-milestone $ARGUMENTS
```

## Source Command

# /pm:milestone — Milestone Tracking

**PM tactical command** — sprint and task management.

## Pipeline

```
DELEGATION: pm:milestone → dev:* → worker:*
OUTPUT: reports/pm/milestone/
```

## Estimated: 2 credits, ~5 minutes

## Execution

Load recipe: `recipes/pm/milestone.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
