---
codex-command: "/frontend-responsive-fix"
source: ".claude/commands/frontend-responsive-fix.md"
invocation: "mekong frontend-responsive-fix $ARGUMENTS"
description: "Frontend responsive fix — audit breakpoints, fix issues, test viewports in 8 min"
argument-hint: "[page or component with responsive issues]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "a4d5d6f4ce02eee0d3b19189905e60d92e172ad7c2f791a250d0df24a33ed176"
---

# /frontend-responsive-fix

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong frontend-responsive-fix $ARGUMENTS
```

## Source Command

# /frontend:responsive-fix — Responsive Fix

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
SEQUENTIAL: /fix --responsive → /e2e-test --viewports           (~8 min)
    |
OUTPUT: reports/frontend/responsive-fix/
```

## Estimated: 5 credits, 8 minutes

## Execution

Load recipe: `recipes/frontend/frontend-responsive-fix.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
