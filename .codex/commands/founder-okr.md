---
codex-command: "/founder-okr"
source: ".claude/commands/founder-okr.md"
invocation: "mekong founder-okr $ARGUMENTS"
description: "Founder OKR setting — vision alignment, quarterly objectives, key results, scoring. 3 steps, ~15 min."
argument-hint: "[quarter or strategic goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "e049a677e79b42d8753d1fcd4d8daf4923abb50be1b7073eece93da5a563b8e2"
---

# /founder-okr

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong founder-okr $ARGUMENTS
```

## Source Command

# /venture:founder-okr — Founder OKRs

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── vision-alignment        → vision.md
  ├── objective-setting       → objectives.md
  └── key-results             → okrs.md
```

## Output directory: reports/venture/founder-okr/
