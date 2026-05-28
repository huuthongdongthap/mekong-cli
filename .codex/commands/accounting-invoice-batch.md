---
codex-command: "/accounting-invoice-batch"
source: ".claude/commands/accounting-invoice-batch.md"
invocation: "mekong accounting-invoice-batch $ARGUMENTS"
description: "Generate invoices, send reminders, update AR. 2 commands, ~8 min."
argument-hint: "[client batch or billing period]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "2bb84e9f51b14cfe807e67ec80810ecd54f25bd3c75cf4db57151dc0273c7019"
---

# /accounting-invoice-batch

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong accounting-invoice-batch $ARGUMENTS
```

## Source Command

# /accounting:invoice-batch — Invoice Batch Processing

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
[process] ─────────────────────────────────────── SEQUENTIAL
  ├── invoice-gen              → invoices.md
  └── email --invoice-reminders → reminders-sent.md
```

## Estimated: 3 credits, 8 minutes

## Execution

Load recipe: `recipes/accounting/invoice-batch.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
