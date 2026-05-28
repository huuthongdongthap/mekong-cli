---
codex-command: "/qa-regression"
source: ".claude/commands/qa-regression.md"
invocation: "mekong qa-regression $ARGUMENTS"
description: "Regression test suite management"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "6bf2ae25ab5b6f656a3e860e33f6d27078caa767516c3231463c03d54d333052"
---

# /qa-regression

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong qa-regression $ARGUMENTS
```

## Source Command

# /qa:regression — Regression Tests

**IC super command** — Regression test suite management

## Pipeline

```
SEQUENTIAL: select-suite → run-regression → diff-report
    |
OUTPUT: reports/qa/regression/
```

## Trigger

Runs recipe `recipes/qa/regression.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/qa:regression [goal]
```

## Estimated: 2 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
