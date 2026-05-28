---
codex-command: "/cook"
source: ".claude/commands/cook.md"
invocation: "mekong cook $ARGUMENTS"
description: "Recipe executor — run a multi-step DAG recipe from recipes/ directory. 1 step, variable time."
argument-hint: "[recipe name from recipes/]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "a7eafcd962cd514f1de5fa7a1c1054f22499b323b6e974aa710203ab2e7b11a0"
---

# /cook

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cook $ARGUMENTS
```

## Source Command

# /core:cook — Recipe Runner

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── recipe-load             → parsed recipe
  └── step-execution          → recipe output
```

## Output directory: reports/core/cook/
