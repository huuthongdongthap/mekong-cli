---
codex-command: "/revops-attribution"
source: ".claude/commands/revops-attribution.md"
invocation: "mekong revops-attribution $ARGUMENTS"
description: "Multi-touch attribution and channel ROI"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "4468f0f5499d793c177a68557ecf85ca74af8d9c6856340c580f0a78b534b784"
---

# /revops-attribution

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong revops-attribution $ARGUMENTS
```

## Source Command

# /revops:attribution — Attribution Analysis

**IC super command** — Multi-touch attribution and channel ROI

## Pipeline

```
SEQUENTIAL: collect-touchpoints → model-attribution → calculate-roi
```

## Trigger

Runs recipe `recipes/revops/attribution.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/revops:attribution [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
