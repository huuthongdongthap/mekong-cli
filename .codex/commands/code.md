---
codex-command: "/code"
source: ".claude/commands/code.md"
invocation: "mekong code $ARGUMENTS"
description: "Code generation from spec — architecture, implementation, tests. 3 steps, ~20 min."
argument-hint: "[feature spec or task description]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "5066362ab9aef4994dd4babcf622c6a709b70334940b144d5b9017a5521d015d"
---

# /code

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong code $ARGUMENTS
```

## Source Command

# /engineering:code — Code Generator

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── architecture-plan       → design.md
  ├── implementation          → src/
  └── test-generation         → tests/
```

## Output directory: reports/engineering/code/
