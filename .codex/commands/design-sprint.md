---
codex-command: "/design-sprint"
source: ".claude/commands/design-sprint.md"
invocation: "mekong design-sprint $ARGUMENTS"
description: "Design sprint — understand → sketch → decide → prototype → test"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "2e3fe79dd21413d5eaa60fea08825a523103113b3f7cb26986eb543fedd79417"
---

# /design-sprint

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong design-sprint $ARGUMENTS
```

## Source Command

# /design:sprint — Design Sprint

**Super command** — chains 4 commands via DAG pipeline.

## Pipeline

```
[understand] ───────────────────────────────────── PARALLEL
  ├── persona                   → user-needs.md
  └── competitor                → design-audit.md
         │
         ▼
[create] ───────────────────────────────────────── SEQUENTIAL
  ├── scope                     → feature-scope.md
  └── demo                      → prototype-spec.md
```

## Estimated: 18 credits, 30 minutes

## Execution

Load recipe: `recipes/design/sprint.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
