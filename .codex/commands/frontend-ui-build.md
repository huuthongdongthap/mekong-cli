---
codex-command: "/frontend-ui-build"
source: ".claude/commands/frontend-ui-build.md"
invocation: "mekong frontend-ui-build $ARGUMENTS"
description: "Frontend UI build — component, styling, responsive, test in 12 min"
argument-hint: "[component or UI feature name]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "ce1da14abef47660d823784086a3729ea7eab3e7409271c7a3d1f2530b1f13ed"
---

# /frontend-ui-build

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong frontend-ui-build $ARGUMENTS
```

## Source Command

# /frontend:ui-build — UI Build

**IC super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
SEQUENTIAL: /component → /cook --frontend → /e2e-test           (~12 min)
    |
OUTPUT: reports/frontend/ui-build/
```

## Estimated: 8 credits, 12 minutes

## Execution

Load recipe: `recipes/frontend/frontend-ui-build.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
