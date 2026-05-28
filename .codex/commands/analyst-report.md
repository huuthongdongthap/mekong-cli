---
codex-command: "/analyst-report"
source: ".claude/commands/analyst-report.md"
invocation: "mekong analyst-report $ARGUMENTS"
description: "Data pull, analysis, executive summary. 2 commands, ~12 min."
argument-hint: "[market, segment, or topic to analyze]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "68e8fee1f9b30a9db83d4be371de8811faddabfef3768316cff22049c714c87e"
---

# /analyst-report

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong analyst-report $ARGUMENTS
```

## Source Command

# /analyst:report — Analyst Report

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
[process] ─────────────────────────────────────── SEQUENTIAL
  ├── market-analysis          → market-data.md
  └── general-report --executive → executive-summary.md
```

## Estimated: 5 credits, 12 minutes

## Execution

Load recipe: `recipes/analyst/report.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
