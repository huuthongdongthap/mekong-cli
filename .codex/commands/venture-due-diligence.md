---
codex-command: "/venture-due-diligence"
source: ".claude/commands/venture-due-diligence.md"
invocation: "mekong venture-due-diligence $ARGUMENTS"
description: "Due diligence report — market analysis, team assessment, financial review, risk factors. 4 steps, ~30 min."
argument-hint: "[company name or investment opportunity]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "90840162daa28791b6110dc3abfba327201725dd3d14b8bc4fc1b22b5c70db63"
---

# /venture-due-diligence

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong venture-due-diligence $ARGUMENTS
```

## Source Command

# /venture:venture-due-diligence — Venture Due Diligence

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── market-analysis         → market.md
  ├── team-assessment         → team.md
  ├── financial-review        → financials.md
  └── risk-analysis           → due-diligence.md
```

## Output directory: reports/venture/venture-due-diligence/
