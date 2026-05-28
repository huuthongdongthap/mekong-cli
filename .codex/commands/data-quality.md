---
codex-command: "/data-quality"
source: ".claude/commands/data-quality.md"
invocation: "mekong data-quality $ARGUMENTS"
description: "Freshness, volume, and schema monitoring"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "a7f403726a8eccde1862ebd0c0dd6d960bc5ebc2531c3dc1f88051424801c0ef"
---

# /data-quality

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong data-quality $ARGUMENTS
```

## Source Command

# /data:quality — Data Quality

**IC super command** — Freshness, volume, and schema monitoring

## Pipeline

```
PARALLEL: freshness-check + volume-check + schema-check
    |
SEQUENTIAL: alert-report
OUTPUT: reports/data/quality/
```

## Trigger

Runs recipe `recipes/data/quality.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/data:quality [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
