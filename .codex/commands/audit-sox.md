---
codex-command: "/audit-sox"
source: ".claude/commands/audit-sox.md"
invocation: "mekong audit-sox $ARGUMENTS"
description: "SOX ICFR testing — walkthroughs, control design, OE"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "444e802d616f9275a4767920b31c7507765da3aa3ad0051d434fcc3972cf60f8"
---

# /audit-sox

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong audit-sox $ARGUMENTS
```

## Source Command

# /audit:sox — SOX Testing

**IC super command** — SOX ICFR testing — walkthroughs, control design, OE

## Pipeline

```
PARALLEL: walkthrough + design-test
    |
SEQUENTIAL: operating-effectiveness → deficiency-report
    |
OUTPUT: reports/audit/sox/
```

## Trigger

Runs recipe `recipes/audit/sox.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/audit:sox [goal]
```

## Estimated: 5 credits, 20 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
