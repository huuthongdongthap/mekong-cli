---
codex-command: "/cto-onboard"
source: ".claude/commands/cto-onboard.md"
invocation: "mekong cto-onboard $ARGUMENTS"
description: "Onboard new project to OpenClaw. 8 credits, ~30 min."
argument-hint: "[project or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "e53f80745cdd7dd29e65aacc266411fcad1d41dd7f173c1fb44b2f404197c9d2"
---

# /cto-onboard

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cto-onboard $ARGUMENTS
```

## Source Command

# /cto:onboard — Project Onboarding

**CTO strategic command** — architecture and team orchestration.

## Pipeline

```
DELEGATION: cto:onboard → pm:* / dev:* → worker:*
OUTPUT: reports/cto/onboard/
```

## Estimated: 8 credits, ~30 minutes

## Execution

Load recipe: `recipes/cto/onboard.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
