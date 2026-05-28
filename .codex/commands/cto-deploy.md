---
codex-command: "/cto-deploy"
source: ".claude/commands/cto-deploy.md"
invocation: "mekong cto-deploy $ARGUMENTS"
description: "Production deployment decision + execution. 5 credits, ~15 min."
argument-hint: "[project or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "20ea992ef623a5dacf909d89abb4d0e17744e0647f2ed5d59bf16d2767a8cca4"
---

# /cto-deploy

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cto-deploy $ARGUMENTS
```

## Source Command

# /cto:deploy — Production Deploy

**CTO strategic command** — architecture and team orchestration.

## Pipeline

```
DELEGATION: cto:deploy → pm:* / dev:* → worker:*
OUTPUT: reports/cto/deploy/
```

## Estimated: 5 credits, ~15 minutes

## Execution

Load recipe: `recipes/cto/deploy.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
