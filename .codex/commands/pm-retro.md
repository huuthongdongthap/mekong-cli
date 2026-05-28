---
codex-command: "/pm-retro"
source: ".claude/commands/pm-retro.md"
invocation: "mekong pm-retro $ARGUMENTS"
description: "Sprint retrospective. 3 credits, ~10 min."
argument-hint: "[task or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "896c59a04a845623837dc101d44d3ce8faf28d1bb79d0bfb9cf3373af8c48bf3"
---

# /pm-retro

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-retro $ARGUMENTS
```

## Source Command

# /pm:retro — Retrospective

**PM tactical command** — sprint and task management.

## Pipeline

```
DELEGATION: pm:retro → dev:* → worker:*
OUTPUT: reports/pm/retro/
```

## Estimated: 3 credits, ~10 minutes

## Execution

Load recipe: `recipes/pm/retro.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
