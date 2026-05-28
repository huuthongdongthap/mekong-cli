---
codex-command: "/founder-ipo"
source: ".claude/commands/founder-ipo.md"
invocation: "mekong founder-ipo $ARGUMENTS"
description: "18-month IPO readiness — audit, S-1, roadshow, day-of execution. 7 commands, ~60 min."
argument-hint: "[founder context or goal]"
allowed-tools: "default"
content-sha256: "4c67c5c4d8483427eb82429edf440254b57e24241418d8c5c8c8016b11c3b0f1"
---

# /founder-ipo

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong founder-ipo $ARGUMENTS
```

## Source Command

# IPO Preparation Pipeline

> Trigger: `/founder:ipo $ARGUMENTS`
> Estimated: ~60 min

## Execution

Load recipe: `recipes/founder/ipo.json`

Run the DAG workflow:

### Readiness Audit (sequential)
- `founder-ipo-pre-ipo-prep`

### S-1 & Roadshow (parallel)
- `founder-ipo-s1`
- `founder-ipo-roadshow`

### Execution Plan (sequential)
- `founder-ipo-ipo-day`
- `founder-ipo-insider`
- `founder-ipo-public-co`
- `founder-ipo-succession`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/ipo`
5. Report completion with summary
