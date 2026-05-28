---
codex-command: "/cto-architect"
source: ".claude/commands/cto-architect.md"
invocation: "mekong cto-architect $ARGUMENTS"
description: "Architecture decision record (ADR). 5 credits, ~15 min."
argument-hint: "[project or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "ca41fc9605948cb7843fd28185f54d6a77716a530f22920aec83ab773110032a"
---

# /cto-architect

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cto-architect $ARGUMENTS
```

## Source Command

# /cto:architect — Architecture Decision

**CTO strategic command** — architecture and team orchestration.

## Pipeline

```
DELEGATION: cto:architect → pm:* / dev:* → worker:*
OUTPUT: reports/cto/architect/
```

## Estimated: 5 credits, ~15 minutes

## Execution

Load recipe: `recipes/cto/architect.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
