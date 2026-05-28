---
codex-command: "/studio-roi"
source: ".claude/commands/studio-roi.md"
invocation: "mekong studio-roi $ARGUMENTS"
description: "ROI scorecard across all projects. 3 credits, ~10 min."
argument-hint: "[context or goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d69a7e76f8e9a5b9b1d9fec555504644ff5a76f1dac8ce8c215558ea850ec520"
---

# /studio-roi

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong studio-roi $ARGUMENTS
```

## Source Command

# /studio:roi — ROI Scorecard

**VC Studio super command** — portfolio-level orchestration.

## Pipeline

```
DELEGATION: studio:roi → cto:* → dev:* → worker:*
OUTPUT: reports/studio/roi/
```

## Estimated: 3 credits, ~10 minutes

## Execution

Load recipe: `recipes/studio/roi.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
