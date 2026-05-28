---
codex-command: "/hr-review"
source: ".claude/commands/hr-review.md"
invocation: "mekong hr-review $ARGUMENTS"
description: "Performance review — self-assessment, peer feedback, manager evaluation, development plan. 4 steps, ~25 min."
argument-hint: "[employee name or role]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "a18c22e3cda2c397f716bc112c6bd5c288cf9ae957e22312e78fc3f1d265a570"
---

# /hr-review

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong hr-review $ARGUMENTS
```

## Source Command

# /hr:hr-review — Performance Review

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── self-assessment         → self-review.md
  ├── peer-feedback           → peer-input.md
  ├── manager-evaluation      → evaluation.md
  └── development-plan        → growth-plan.md
```

## Output directory: reports/hr/hr-review/
