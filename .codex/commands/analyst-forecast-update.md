---
codex-command: "/analyst-forecast-update"
source: ".claude/commands/analyst-forecast-update.md"
invocation: "mekong analyst-forecast-update $ARGUMENTS"
description: "Pull actuals, compare, update model, variance report. 2 commands, ~8 min."
argument-hint: "[period or model to update]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "c51f09de3909f85130c4696adf0c252567f9c9e2691186438ee7cc0d731ab7fe"
---

# /analyst-forecast-update

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong analyst-forecast-update $ARGUMENTS
```

## Source Command

# /analyst:forecast-update — Forecast Update

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
[process] ─────────────────────────────────────── SEQUENTIAL
  ├── forecast --update        → forecast-model.md
  └── financial-report --variance → variance-report.md
```

## Estimated: 5 credits, 8 minutes

## Execution

Load recipe: `recipes/analyst/forecast-update.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
