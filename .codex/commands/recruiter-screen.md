---
codex-command: "/recruiter-screen"
source: ".claude/commands/recruiter-screen.md"
invocation: "mekong recruiter-screen $ARGUMENTS"
description: "Resume analysis, score candidates, interview questions. 2 commands, ~8 min."
argument-hint: "[candidate name or batch]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "93c917d4e20b2e1725993c7ba72b86a59d3645185a942f691e8e80b8aee19c6c"
---

# /recruiter-screen

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong recruiter-screen $ARGUMENTS
```

## Source Command

# /recruiter:screen — Candidate Screening

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
[process] ─────────────────────────────────────── SEQUENTIAL
  ├── performance-review --candidate → candidate-scores.md
  └── schedule --interviews    → interview-schedule.md
```

## Estimated: 5 credits, 8 minutes

## Execution

Load recipe: `recipes/recruiter/screen.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
