---
codex-command: "/raas/pipeline"
source: ".claude/commands/raas/pipeline.md"
invocation: "mekong raas/pipeline $ARGUMENTS"
description: "Build and manage sales pipeline. 1 command, ~20-30 min."
argument-hint: "[deal stage or metric]"
allowed-tools: "Read, Write, Task"
content-sha256: "36ad644d53358dc87db98d66ae66cd17700565eed5eb681c33d21240a2f2ad95"
---

# /raas/pipeline

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong raas/pipeline $ARGUMENTS
```

## Source Command

# /pipeline — Sales Pipeline Management

**Sales** — single command.

## Estimated: 3 credits, 20-30 minutes

## Workflow

[Review Pipeline] → [Update Deal Stages] → [Identify At-Risk Deals] → [Forecast Revenue] → [Generate Report] → [Alert on Blockers]

## Output

- Pipeline summary by stage
- Conversion rates
- Weighted revenue forecast
- Deals requiring attention
