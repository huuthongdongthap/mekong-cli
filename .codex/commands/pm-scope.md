---
codex-command: "/pm-scope"
source: ".claude/commands/pm-scope.md"
invocation: "mekong pm-scope $ARGUMENTS"
description: "Scope definition and boundary setting. 3 credits, ~10 min."
argument-hint: "[task or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "285add2151d8e83911ef99b1d21ae2514b794127113df663a03e56ca21443ea5"
---

# /pm-scope

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-scope $ARGUMENTS
```

## Source Command

# /pm:scope — Scope Definition

**PM tactical command** — sprint and task management.

## Pipeline

```
DELEGATION: pm:scope → dev:* → worker:*
OUTPUT: reports/pm/scope/
```

## Estimated: 3 credits, ~10 minutes

## Execution

Load recipe: `recipes/pm/scope.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
