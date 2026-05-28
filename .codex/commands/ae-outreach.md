---
codex-command: "/ae-outreach"
source: ".claude/commands/ae-outreach.md"
invocation: "mekong ae-outreach $ARGUMENTS"
description: "Sales outreach sequences — prospect research, email drafts, follow-up cadence. 3 steps, ~15 min."
argument-hint: "[target company or persona]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "115499b2d5824fdbe3d2ceb48d5f0dc187e91031f78a2ca31e324ee2b6859a86"
---

# /ae-outreach

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ae-outreach $ARGUMENTS
```

## Source Command

# /sales:ae-outreach — Sales Outreach Sequences

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── prospect-research       → prospect-profile.md
  ├── outreach-draft          → email-sequences.md
  └── follow-up-cadence       → cadence-schedule.md
```

## Output directory: reports/sales/ae-outreach/
