---
codex-command: "/hr-onboard"
source: ".claude/commands/hr-onboard.md"
invocation: "mekong hr-onboard $ARGUMENTS"
description: "Employee onboarding — welcome kit → access setup → 30-60-90 plan → buddy assignment"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "f5056bdffcda3a9eca1203b8a8f381f727d1acf944d5cb9fd31187220d056879"
---

# /hr-onboard

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong hr-onboard $ARGUMENTS
```

## Source Command

# /hr:onboard — Employee Onboarding

**Super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
[setup] ────────────────────────────────────────── PARALLEL
  ├── hr-management --onboard   → welcome-kit.md
  └── schedule                  → first-week-schedule.md
         │
         ▼
[plan] ─────────────────────────────────────────── SEQUENTIAL
  └── plan --30-60-90           → onboarding-plan.md
```

## Estimated: 8 credits, 10 minutes

## Execution

Load recipe: `recipes/hr/onboard.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
