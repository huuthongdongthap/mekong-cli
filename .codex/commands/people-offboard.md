---
codex-command: "/people-offboard"
source: ".claude/commands/people-offboard.md"
invocation: "mekong people-offboard $ARGUMENTS"
description: "Exit checklist, access revocation, knowledge transfer. 2 commands, ~5 min."
argument-hint: "[departing employee name or last day]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "0d41a5cc476044c231003c36dc1566da5c0efd45f23fd484cdf992dce8b9ec87"
---

# /people-offboard

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong people-offboard $ARGUMENTS
```

## Source Command

# /people:offboard — Employee Offboarding

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
[process] ─────────────────────────────────────── SEQUENTIAL
  ├── hr-management --offboard → exit-checklist.md
  └── handoff                  → knowledge-transfer.md
```

## Estimated: 3 credits, 5 minutes

## Execution

Load recipe: `recipes/people/offboard.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
