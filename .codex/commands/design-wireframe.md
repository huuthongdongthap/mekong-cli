---
codex-command: "/design-wireframe"
source: ".claude/commands/design-wireframe.md"
invocation: "mekong design-wireframe $ARGUMENTS"
description: "Wireframe generation — user flows, screen layouts, interaction specs. 3 steps, ~20 min."
argument-hint: "[feature or screen name]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "32cbc0b68ae1f07c13989e430a53606ff21c1546f31a9e71a93364dfa0144e17"
---

# /design-wireframe

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong design-wireframe $ARGUMENTS
```

## Source Command

# /design:design-wireframe — Wireframe Generator

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── user-flow               → user-flow.md
  ├── screen-layout           → wireframes.md
  └── interaction-spec        → interactions.md
```

## Output directory: reports/design/design-wireframe/
