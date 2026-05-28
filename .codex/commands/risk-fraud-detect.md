---
codex-command: "/risk-fraud-detect"
source: ".claude/commands/risk-fraud-detect.md"
invocation: "mekong risk-fraud-detect $ARGUMENTS"
description: "Anti-fraud monitoring"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "2002e35e80fc14948682ac6f5f0674f427c10ddb210c4531c8c3e8646b5c40c0"
---

# /risk-fraud-detect

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong risk-fraud-detect $ARGUMENTS
```

## Source Command

# /risk:fraud-detect — Fraud Detection

**IC super command** — Anti-fraud monitoring

## Pipeline

```
SEQUENTIAL: detect-anomalies → flag-violations
    |
OUTPUT: reports/risk/fraud-detect/
```

## Trigger

Runs recipe `recipes/risk/fraud-detect.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/risk:fraud-detect [goal]
```

## Estimated: 2 credits, 5 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
