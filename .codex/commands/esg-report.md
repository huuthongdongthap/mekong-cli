---
codex-command: "/esg-report"
source: ".claude/commands/esg-report.md"
invocation: "mekong esg-report $ARGUMENTS"
description: "Sustainability reporting with GRI/SASB frameworks"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "4c615cb1bb240183795cab1cc6d2fd46f69c1c74f989596d4ba3db7b14acc251"
---

# /esg-report

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong esg-report $ARGUMENTS
```

## Source Command

# /esg:report — ESG Report

**IC super command** — Sustainability reporting with GRI/SASB frameworks

## Pipeline

```
PARALLEL: collect-environmental + collect-social + collect-governance\n    |\nSEQUENTIAL: compile-report
```

## Trigger

Runs recipe `recipes/esg/report.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/esg:report [goal]
```

## Estimated: 3 credits, 12 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
