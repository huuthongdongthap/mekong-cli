---
codex-command: "/data-full-refresh"
source: ".claude/commands/data-full-refresh.md"
invocation: "mekong data-full-refresh $ARGUMENTS"
description: "Full refresh — ingest, transform, quality, catalog in parallel, then metrics"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "7485f8b7630b46684e7ce2a6823031fcde80d385872e3504954f75488a634fa0"
---

# /data-full-refresh

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong data-full-refresh $ARGUMENTS
```

## Source Command

# /data:full-refresh — Full Data Refresh

**Super command** — chains multiple commands via DAG pipeline.

## Pipeline

```
PARALLEL: /data:ingest + /data:transform + /data:quality + /data:catalog
    |
SEQUENTIAL: /data:metric
    |
OUTPUT: reports/data/full-refresh/
```

## Trigger

Runs recipe `recipes/data/full-refresh.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Spawn parallel subagents via Task tool
3. Wait for all groups to complete
4. Compile into summary report

## Usage

```
/data:full-refresh [goal]
```

## Estimated: 13 credits, 30 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
