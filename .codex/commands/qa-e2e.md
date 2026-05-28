---
codex-command: "/qa-e2e"
source: ".claude/commands/qa-e2e.md"
invocation: "mekong qa-e2e $ARGUMENTS"
description: "End-to-end test execution with Playwright"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "0ecdc2ab284f3458825d4e8906f59ea7797b42959b2f1b36cb8a6385fe383a89"
---

# /qa-e2e

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong qa-e2e $ARGUMENTS
```

## Source Command

# /qa:e2e — E2E Tests

**IC super command** — End-to-end test execution with Playwright

## Pipeline

```
SEQUENTIAL: run-playwright → collect-results → report
    |
OUTPUT: reports/qa/e2e/
```

## Trigger

Runs recipe `recipes/qa/e2e.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/qa:e2e [goal]
```

## Estimated: 3 credits, 12 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
