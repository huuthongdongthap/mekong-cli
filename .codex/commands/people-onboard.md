---
codex-command: "/people-onboard"
source: ".claude/commands/people-onboard.md"
invocation: "mekong people-onboard $ARGUMENTS"
description: "Welcome email, access setup, day-1 schedule. 2 commands, ~5 min."
argument-hint: "[new hire name or start date]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "27b6a7332ba8c8500e617b2f1a7004b6b1e9032fea8d025f03897efee6f8f16d"
---

# /people-onboard

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong people-onboard $ARGUMENTS
```

## Source Command

# /people:onboard — Employee Onboarding

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
[process] ─────────────────────────────────────── PARALLEL
  ├── email --welcome          → welcome-email.md
  └── schedule --first-week    → day-1-schedule.md
```

## Estimated: 3 credits, 5 minutes

## Execution

Load recipe: `recipes/people/onboard.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
