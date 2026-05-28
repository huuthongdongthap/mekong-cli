---
codex-command: "/data-catalog"
source: ".claude/commands/data-catalog.md"
invocation: "mekong data-catalog $ARGUMENTS"
description: "Data discovery and lineage tracking"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "a1abdfe43226e513758bec2a8d0549d3db57d175d0588cf492f09b38aa2757b7"
---

# /data-catalog

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong data-catalog $ARGUMENTS
```

## Source Command

# /data:catalog — Data Catalog

**IC super command** — Data discovery and lineage tracking

## Pipeline

```
SEQUENTIAL: crawl-sources → classify-pii → publish-catalog
OUTPUT: reports/data/catalog/
```

## Trigger

Runs recipe `recipes/data/catalog.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/data:catalog [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
