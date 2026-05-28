---
codex-command: "/ae-close-report"
source: ".claude/commands/ae-close-report.md"
invocation: "mekong ae-close-report $ARGUMENTS"
description: "Close report — win/loss analysis then CRM update. 2 commands, ~5 min."
argument-hint: "[deal-name-and-outcome]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "053a693d3ea844f26442aeed8cb007236de81bddced7648ddcac73da6f8196be"
---

# /ae-close-report

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ae-close-report $ARGUMENTS
```

## Source Command

# /ae:close-report — Close Report

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
SEQUENTIAL: /close
    |
SEQUENTIAL: /crm --update
    |
OUTPUT: reports/ae/close/
        win-loss-analysis.md
        crm-update.md
        CLOSE-REPORT-SUMMARY.md
```

## Trigger

Runs recipe `recipes/ae/ae-close-report.json` through DAGScheduler.

## Execution

1. Read recipe DAG definition
2. Run /close first (mode: sequential) to produce win/loss analysis
3. Run /crm --update using analysis output as context
4. Compile into CLOSE-REPORT-SUMMARY.md with lessons learned and CRM fields

## Usage

```
/ae:close-report [deal-name-and-outcome]
```

## Estimated: 3 credits, 5 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
