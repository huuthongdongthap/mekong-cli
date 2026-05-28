---
codex-command: "/pm-delegate"
source: ".claude/commands/pm-delegate.md"
invocation: "mekong pm-delegate $ARGUMENTS"
description: "Break task and delegate to dev level. 3 credits, ~10 min."
argument-hint: "[task or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "951e248c5a7449ac5d16903e4fa85a89ce49160d1cfd5054ca05ef3ddf9cc2cf"
---

# /pm-delegate

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-delegate $ARGUMENTS
```

## Source Command

# /pm:delegate — Task Delegation

**PM tactical command** — sprint and task management.

## Pipeline

```
DELEGATION: pm:delegate → dev:* → worker:*
OUTPUT: reports/pm/delegate/
```

## Estimated: 3 credits, ~10 minutes

## Execution

Load recipe: `recipes/pm/delegate.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
