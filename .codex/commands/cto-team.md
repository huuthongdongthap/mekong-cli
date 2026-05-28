---
codex-command: "/cto-team"
source: ".claude/commands/cto-team.md"
invocation: "mekong cto-team $ARGUMENTS"
description: "Team capacity planning and task routing. 3 credits, ~10 min."
argument-hint: "[project or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "746c6c25a8a0684617d28739b917d7ba29f8dc1fc3ca1da9666b566c1253b2ad"
---

# /cto-team

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cto-team $ARGUMENTS
```

## Source Command

# /cto:team — Team Planning

**CTO strategic command** — architecture and team orchestration.

## Pipeline

```
DELEGATION: cto:team → pm:* / dev:* → worker:*
OUTPUT: reports/cto/team/
```

## Estimated: 3 credits, ~10 minutes

## Execution

Load recipe: `recipes/cto/team.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
