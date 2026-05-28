---
codex-command: "/pm-plan"
source: ".claude/commands/pm-plan.md"
invocation: "mekong pm-plan $ARGUMENTS"
description: "Create implementation plan with phases. 5 credits, ~15 min."
argument-hint: "[task or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "f915e3da8b5637030f1c43e8547ebe2642a8a4a0c5a39406d42e87f9ef188d22"
---

# /pm-plan

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-plan $ARGUMENTS
```

## Source Command

# /pm:plan — Implementation Plan

**PM tactical command** — sprint and task management.

## Pipeline

```
DELEGATION: pm:plan → dev:* → worker:*
OUTPUT: reports/pm/plan/
```

## Estimated: 5 credits, ~15 minutes

## Execution

Load recipe: `recipes/pm/plan.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
