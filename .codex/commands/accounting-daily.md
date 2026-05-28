---
codex-command: "/accounting-daily"
source: ".claude/commands/accounting-daily.md"
invocation: "mekong accounting-daily $ARGUMENTS"
description: "Transaction review, categorize, reconcile, flag anomalies. 2 commands, ~8 min."
argument-hint: "[date or period to reconcile]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "f6d29489374940e1cb4760a7662e303f5b1b4c3e966143e251316c3001a0167d"
---

# /accounting-daily

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong accounting-daily $ARGUMENTS
```

## Source Command

# /accounting:daily — Daily Bookkeeping

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
[process] ─────────────────────────────────────── SEQUENTIAL
  ├── expense --review         → transactions.md
  └── cashflow --daily         → reconciliation.md
```

## Estimated: 3 credits, 8 minutes

## Execution

Load recipe: `recipes/accounting/daily.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
