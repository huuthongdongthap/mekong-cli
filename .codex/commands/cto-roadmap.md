---
codex-command: "/cto-roadmap"
source: ".claude/commands/cto-roadmap.md"
invocation: "mekong cto-roadmap $ARGUMENTS"
description: "Technical roadmap generation. 5 credits, ~20 min."
argument-hint: "[project or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "30bc447583c5630d974377ff35ffec14ba30200e345d4c685cfc50a053024296"
---

# /cto-roadmap

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cto-roadmap $ARGUMENTS
```

## Source Command

# /cto:roadmap — Technical Roadmap

**CTO strategic command** — architecture and team orchestration.

## Pipeline

```
DELEGATION: cto:roadmap → pm:* / dev:* → worker:*
OUTPUT: reports/cto/roadmap/
```

## Estimated: 5 credits, ~20 minutes

## Execution

Load recipe: `recipes/cto/roadmap.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
