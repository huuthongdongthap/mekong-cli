---
codex-command: "/data-ingest"
source: ".claude/commands/data-ingest.md"
invocation: "mekong data-ingest $ARGUMENTS"
description: "Pipeline orchestration with Fivetran/Airbyte connectors"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "a5d7dc58d66816c4168a78acd85f20096ba7aca3d2a45de2f46bc249f404acca"
---

# /data-ingest

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong data-ingest $ARGUMENTS
```

## Source Command

# /data:ingest — Data Ingestion

**IC super command** — Pipeline orchestration with Fivetran/Airbyte connectors

## Pipeline

```
SEQUENTIAL: configure-connectors → extract-load → verify-landing
OUTPUT: reports/data/ingest/
```

## Trigger

Runs recipe `recipes/data/ingest.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/data:ingest [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
