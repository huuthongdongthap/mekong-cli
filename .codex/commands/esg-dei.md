---
codex-command: "/esg-dei"
source: ".claude/commands/esg-dei.md"
invocation: "mekong esg-dei $ARGUMENTS"
description: "Diversity metrics and reporting"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "ff57c0970e4c2f8cc366615e3759ee4151ef683d06617f9ea35cd7222dcbfa99"
---

# /esg-dei

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong esg-dei $ARGUMENTS
```

## Source Command

# /esg:dei — DEI Metrics

**IC super command** — Diversity metrics and reporting

## Pipeline

```
SEQUENTIAL: collect-data → analyze-gaps → action-plan → report
```

## Trigger

Runs recipe `recipes/esg/dei.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/esg:dei [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
