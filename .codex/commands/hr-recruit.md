---
codex-command: "/hr-recruit"
source: ".claude/commands/hr-recruit.md"
invocation: "mekong hr-recruit $ARGUMENTS"
description: "Recruiting pipeline — JD → sourcing → interview kit → offer template"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "b91840006ddbeaa9fa0bb6d475ca9148c8e926ea608242e7e862d93e8ab3d8c0"
---

# /hr-recruit

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong hr-recruit $ARGUMENTS
```

## Source Command

# /hr:recruit — Recruiting Pipeline

**Super command** — chains 4 commands via DAG pipeline.

## Pipeline

```
[prepare] ─────────────────────────────────────── PARALLEL
  ├── hr-management --jd        → job-description.md
  └── budget --comp             → comp-benchmark.md
         │
         ▼
[process] ─────────────────────────────────────── SEQUENTIAL
  ├── leadgen --talent          → candidate-sources.md
  └── schedule                  → interview-process.md
```

## Estimated: 15 credits, 20 minutes

## Execution

Load recipe: `recipes/hr/recruit.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
