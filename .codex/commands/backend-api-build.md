---
codex-command: "/backend-api-build"
source: ".claude/commands/backend-api-build.md"
invocation: "mekong backend-api-build $ARGUMENTS"
description: "Backend API build — schema, implement, test, docs. Full API cycle in 12 min"
argument-hint: "[API endpoint or resource name]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "cd7b7b1dfb5e11a38c2a1d81808861e57c77fd78e9c75a736181e66801b326c7"
---

# /backend-api-build

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong backend-api-build $ARGUMENTS
```

## Source Command

# /backend:api-build — API Build

**IC super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
SEQUENTIAL: /schema → /cook --api → /test --api                 (~12 min)
    |
OUTPUT: reports/backend/api-build/
```

## Estimated: 8 credits, 12 minutes

## Execution

Load recipe: `recipes/backend/backend-api-build.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
