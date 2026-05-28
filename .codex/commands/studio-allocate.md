---
codex-command: "/studio-allocate"
source: ".claude/commands/studio-allocate.md"
invocation: "mekong studio-allocate $ARGUMENTS"
description: "Reallocate MCU budget across projects. 3 credits, ~10 min."
argument-hint: "[context or goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "4af9c0dd87aa937ea09900de7a3930ba419c39dca8c0947c6853751ee06306a4"
---

# /studio-allocate

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong studio-allocate $ARGUMENTS
```

## Source Command

# /studio:allocate — Budget Allocation

**VC Studio super command** — portfolio-level orchestration.

## Pipeline

```
DELEGATION: studio:allocate → cto:* → dev:* → worker:*
OUTPUT: reports/studio/allocate/
```

## Estimated: 3 credits, ~10 minutes

## Execution

Load recipe: `recipes/studio/allocate.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
