---
codex-command: "/studio-divest"
source: ".claude/commands/studio-divest.md"
invocation: "mekong studio-divest $ARGUMENTS"
description: "Archive/sunset a portfolio project. 5 credits, ~15 min."
argument-hint: "[context or goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "fba8c93f1c0eff507425be2a77b9ab774c9b58d8509120cc61f4a7df7a23d337"
---

# /studio-divest

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong studio-divest $ARGUMENTS
```

## Source Command

# /studio:divest — Project Divestment

**VC Studio super command** — portfolio-level orchestration.

## Pipeline

```
DELEGATION: studio:divest → cto:* → dev:* → worker:*
OUTPUT: reports/studio/divest/
```

## Estimated: 5 credits, ~15 minutes

## Execution

Load recipe: `recipes/studio/divest.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
