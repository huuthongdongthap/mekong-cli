---
codex-command: "/data-warehouse"
source: ".claude/commands/data-warehouse.md"
invocation: "mekong data-warehouse $ARGUMENTS"
description: "Warehouse administration and cost monitoring"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "4ba04fdb90120b57b575460d90d4741691fb266a17ba66716eeb2089232b74cd"
---

# /data-warehouse

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong data-warehouse $ARGUMENTS
```

## Source Command

# /data:warehouse — Warehouse Admin

**IC super command** — Warehouse administration and cost monitoring

## Pipeline

```
SEQUENTIAL: usage-stats → cost-analysis → optimization-recs
OUTPUT: reports/data/warehouse/
```

## Trigger

Runs recipe `recipes/data/warehouse.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/data:warehouse [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
