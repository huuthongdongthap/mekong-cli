---
codex-command: "/data-pipeline"
source: ".claude/commands/data-pipeline.md"
invocation: "mekong data-pipeline $ARGUMENTS"
description: "Data pipeline setup — source config, transform logic, destination mapping, validation. 4 steps, ~20 min."
argument-hint: "[data source and destination]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "836664a84c14f6a05e9d816562756a8150a4838ae3cba622d866d58b3c278388"
---

# /data-pipeline

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong data-pipeline $ARGUMENTS
```

## Source Command

# /data:data-pipeline — Data Pipeline

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── source-config           → source-schema.md
  ├── transform-logic         → transforms.md
  ├── destination-mapping     → mapping.md
  └── validation-rules        → validation.md
```

## Output directory: reports/data/data-pipeline/
