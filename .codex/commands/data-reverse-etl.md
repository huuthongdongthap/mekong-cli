---
codex-command: "/data-reverse-etl"
source: ".claude/commands/data-reverse-etl.md"
invocation: "mekong data-reverse-etl $ARGUMENTS"
description: "Push warehouse data to CRM and tools"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d28e700ed8c4f0b9174bf85459d302eb83c817f96cab929b0205d8f859e27a27"
---

# /data-reverse-etl

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong data-reverse-etl $ARGUMENTS
```

## Source Command

# /data:reverse-etl — Reverse ETL

**IC super command** — Push warehouse data to CRM and tools

## Pipeline

```
SEQUENTIAL: select-segments → sync-destinations → verify-delivery
OUTPUT: reports/data/reverse-etl/
```

## Trigger

Runs recipe `recipes/data/reverse-etl.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/data:reverse-etl [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
