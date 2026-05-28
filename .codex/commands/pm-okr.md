---
codex-command: "/pm-okr"
source: ".claude/commands/pm-okr.md"
invocation: "mekong pm-okr $ARGUMENTS"
description: "Set/review OKRs and key results. 3 credits, ~10 min."
argument-hint: "[task or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "fa68e001e45dcd7ea859b88b2a73e8acf67e1a10e6934c6cdb09ef08ceb0b223"
---

# /pm-okr

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-okr $ARGUMENTS
```

## Source Command

# /pm:okr — OKR Review

**PM tactical command** — sprint and task management.

## Pipeline

```
DELEGATION: pm:okr → dev:* → worker:*
OUTPUT: reports/pm/okr/
```

## Estimated: 3 credits, ~10 minutes

## Execution

Load recipe: `recipes/pm/okr.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
