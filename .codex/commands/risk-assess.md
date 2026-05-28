---
codex-command: "/risk-assess"
source: ".claude/commands/risk-assess.md"
invocation: "mekong risk-assess $ARGUMENTS"
description: "Enterprise risk library and scoring"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "0c2384b9e96f2b6e31e89b958933ee77d5bba66b89a946a0644bba3cec25bce1"
---

# /risk-assess

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong risk-assess $ARGUMENTS
```

## Source Command

# /risk:assess — Risk Assessment

**IC super command** — Enterprise risk library and scoring

## Pipeline

```
PARALLEL: catalog-processes + identify-risks
    |
SEQUENTIAL: map-controls → score-residual
    |
OUTPUT: reports/risk/assess/
```

## Trigger

Runs recipe `recipes/risk/assess.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/risk:assess [goal]
```

## Estimated: 5 credits, 20 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
