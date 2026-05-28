---
codex-command: "/marketing-campaign"
source: ".claude/commands/marketing-campaign.md"
invocation: "mekong marketing-campaign $ARGUMENTS"
description: "Campaign planning — audience, channels, content, budget, timeline, KPIs. 4 steps, ~25 min."
argument-hint: "[campaign goal or product launch]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "4f8827d9bf99e163b8ab2efc68d3e307955585b122f5e9c9ba0242eb3cf9f494"
---

# /marketing-campaign

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong marketing-campaign $ARGUMENTS
```

## Source Command

# /marketing:marketing-campaign — Marketing Campaign

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── audience-research       → personas.md
  ├── channel-strategy        → channels.md
  ├── content-plan            → content-calendar.md
  └── budget-kpis             → campaign-plan.md
```

## Output directory: reports/marketing/marketing-campaign/
