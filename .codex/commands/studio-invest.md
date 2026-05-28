---
codex-command: "/studio-invest"
source: ".claude/commands/studio-invest.md"
invocation: "mekong studio-invest $ARGUMENTS"
description: "Add new project to portfolio. 8 credits, ~30 min."
argument-hint: "[context or goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "ea72f25382dbd48b5b418184746fd1124a725f73c799049ec6abbf934e571254"
---

# /studio-invest

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong studio-invest $ARGUMENTS
```

## Source Command

# /studio:invest — New Investment

**VC Studio super command** — portfolio-level orchestration.

## Pipeline

```
DELEGATION: studio:invest → cto:* → dev:* → worker:*
OUTPUT: reports/studio/invest/
```

## Estimated: 8 credits, ~30 minutes

## Execution

Load recipe: `recipes/studio/invest.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
