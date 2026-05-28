---
codex-command: "/design-system"
source: ".claude/commands/design-system.md"
invocation: "mekong design-system $ARGUMENTS"
description: "Design system scaffold — tokens, components, patterns, documentation. 4 steps, ~30 min."
argument-hint: "[brand or product name]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "99e3306753d8c17c4582ff1ec51f3d2ce02501990135825ade7fdaba0912ebb0"
---

# /design-system

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong design-system $ARGUMENTS
```

## Source Command

# /design:design-system — Design System

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── design-tokens           → tokens.json
  ├── component-inventory     → components.md
  ├── pattern-library         → patterns.md
  └── documentation           → design-system.md
```

## Output directory: reports/design/design-system/
