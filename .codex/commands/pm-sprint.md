---
codex-command: "/pm-sprint"
source: ".claude/commands/pm-sprint.md"
invocation: "mekong pm-sprint $ARGUMENTS"
description: "Sprint planning — backlog to sprint tasks. 3 credits, ~15 min."
argument-hint: "[task or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "75f3a19be252aa8c12f5b709e6a0fd43b1800d2e768e4f8ac7777a81cfa36c09"
---

# /pm-sprint

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-sprint $ARGUMENTS
```

## Source Command

# /pm:sprint — Sprint Planning

**PM tactical command** — sprint and task management.

## Pipeline

```
DELEGATION: pm:sprint → dev:* → worker:*
OUTPUT: reports/pm/sprint/
```

## Estimated: 3 credits, ~15 minutes

## Execution

Load recipe: `recipes/pm/sprint.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
