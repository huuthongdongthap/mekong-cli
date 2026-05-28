---
codex-command: "/cto-incident"
source: ".claude/commands/cto-incident.md"
invocation: "mekong cto-incident $ARGUMENTS"
description: "Incident response orchestration. 8 credits, ~20 min."
argument-hint: "[project or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "92d6dfd4884406921a4eccdae318fa50c9f4c7ce93d4821d9bba60913e7261cf"
---

# /cto-incident

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cto-incident $ARGUMENTS
```

## Source Command

# /cto:incident — Incident Response

**CTO strategic command** — architecture and team orchestration.

## Pipeline

```
DELEGATION: cto:incident → pm:* / dev:* → worker:*
OUTPUT: reports/cto/incident/
```

## Estimated: 8 credits, ~20 minutes

## Execution

Load recipe: `recipes/cto/incident.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
