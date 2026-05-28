---
codex-command: "/risk-report"
source: ".claude/commands/risk-report.md"
invocation: "mekong risk-report $ARGUMENTS"
description: "Board-ready risk reports"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "73df1e5c5a5627b675b541e98dcd05ae1a98e3c95c74c3576381614f77eff80b"
---

# /risk-report

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong risk-report $ARGUMENTS
```

## Source Command

# /risk:report — Risk Report

**IC super command** — Board-ready risk reports

## Pipeline

```
SEQUENTIAL: heat-map → deficiency-track → remediation-status
    |
OUTPUT: reports/risk/report/
```

## Trigger

Runs recipe `recipes/risk/report.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/risk:report [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
