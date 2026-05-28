---
codex-command: "/sales-forecast"
source: ".claude/commands/sales-forecast.md"
invocation: "mekong sales-forecast $ARGUMENTS"
description: "Sales forecast — pipeline analysis, conversion rates, revenue projection, risk factors. 3 steps, ~15 min."
argument-hint: "[quarter or time period]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "79f71c18b8f135d2428c2554a57257bd14902fccae35145568d2dc028d3cac17"
---

# /sales-forecast

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sales-forecast $ARGUMENTS
```

## Source Command

# /sales:sales-forecast — Sales Forecast

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── pipeline-analysis       → pipeline-health.md
  ├── conversion-rates        → conversion.md
  └── revenue-projection      → forecast.md
```

## Output directory: reports/sales/sales-forecast/
