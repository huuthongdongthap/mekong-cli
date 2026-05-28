---
codex-command: "/data-transform"
source: ".claude/commands/data-transform.md"
invocation: "mekong data-transform $ARGUMENTS"
description: "dbt run/test with lineage tracking"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "ec26340257c59b7547a922eb1ef5573d492cb457bcc307f418aee5764ab099ee"
---

# /data-transform

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong data-transform $ARGUMENTS
```

## Source Command

# /data:transform — Data Transform

**IC super command** — dbt run/test with lineage tracking

## Pipeline

```
SEQUENTIAL: dbt-run → dbt-test → update-lineage
OUTPUT: reports/data/transform/
```

## Trigger

Runs recipe `recipes/data/transform.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/data:transform [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
