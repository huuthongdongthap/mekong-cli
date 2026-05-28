---
codex-command: "/vendor-spend"
source: ".claude/commands/vendor-spend.md"
invocation: "mekong vendor-spend $ARGUMENTS"
description: "License optimization and usage tracking"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "3a5f67a3fb0e0315dc12a9e7665705d7199d08f1a035a32599220a876d8548c5"
---

# /vendor-spend

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong vendor-spend $ARGUMENTS
```

## Source Command

# /vendor:spend — Vendor Spend

**IC super command** — License optimization and usage tracking

## Pipeline

```
SEQUENTIAL: collect-invoices → analyze-usage → optimize
```

## Trigger

Runs recipe `recipes/vendor/spend.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/vendor:spend [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
