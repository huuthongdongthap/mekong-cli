---
codex-command: "/data-query"
source: ".claude/commands/data-query.md"
invocation: "mekong data-query $ARGUMENTS"
description: "Data analysis query — SQL/query generation, execution plan, result interpretation. 2 steps, ~10 min."
argument-hint: "[question about data or dataset]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "bbc3323ce59b7212e44cfac453abcad41bda62299e532508c7e80ee8eeb77315"
---

# /data-query

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong data-query $ARGUMENTS
```

## Source Command

# /data:data-query — Data Query Analyst

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── query-generation        → query.sql
  └── result-interpretation   → analysis.md
```

## Output directory: reports/data/data-query/
