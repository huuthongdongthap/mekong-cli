---
codex-command: "/cto-scorecard"
source: ".claude/commands/cto-scorecard.md"
invocation: "mekong cto-scorecard $ARGUMENTS"
description: "CTO ROI scorecard for single project. 3 credits, ~10 min."
argument-hint: "[project or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "116ce9b1055c4d0f6d461387a434bb977f0091c4ad80bb2e5a5c1eb611903710"
---

# /cto-scorecard

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cto-scorecard $ARGUMENTS
```

## Source Command

# /cto:scorecard — ROI Scorecard

**CTO strategic command** — architecture and team orchestration.

## Pipeline

```
DELEGATION: cto:scorecard → pm:* / dev:* → worker:*
OUTPUT: reports/cto/scorecard/
```

## Estimated: 3 credits, ~10 minutes

## Execution

Load recipe: `recipes/cto/scorecard.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
