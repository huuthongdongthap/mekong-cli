---
codex-command: "/qa-perf"
source: ".claude/commands/qa-perf.md"
invocation: "mekong qa-perf $ARGUMENTS"
description: "Performance and load testing with k6"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d751676c5a79ea6260c3e81474cea1cc4d851ffd31930ce388d44fa6267eaa25"
---

# /qa-perf

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong qa-perf $ARGUMENTS
```

## Source Command

# /qa:perf — Performance Testing

**IC super command** — Performance and load testing with k6

## Pipeline

```
PARALLEL: configure-k6 + warm-up
    |
SEQUENTIAL: execute-load-test → analyze-results
    |
OUTPUT: reports/qa/perf/
```

## Trigger

Runs recipe `recipes/qa/perf.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/qa:perf [goal]
```

## Estimated: 3 credits, 12 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
