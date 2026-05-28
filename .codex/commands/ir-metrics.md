---
codex-command: "/ir-metrics"
source: ".claude/commands/ir-metrics.md"
invocation: "mekong ir-metrics $ARGUMENTS"
description: "Automated SaaS metrics for investors — ARR, NRR, Rule of 40"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d5ef479ccd4d1631b34780c24a235c362a10323114e89d35311a6400b5c9666b"
---

# /ir-metrics

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ir-metrics $ARGUMENTS
```

## Source Command

# /ir:metrics — Investor Metrics

**IC super command** — Automated SaaS metrics for investors — ARR, NRR, Rule of 40

## Pipeline

```
PARALLEL: pull-revenue-data + pull-retention-data
    |
SEQUENTIAL: calculate-metrics → format-deck
OUTPUT: reports/governance/ir-metrics/
```

## Trigger

Runs recipe `recipes/ir/metrics.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/ir:metrics [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
