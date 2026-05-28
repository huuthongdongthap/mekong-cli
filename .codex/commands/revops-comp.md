---
codex-command: "/revops-comp"
source: ".claude/commands/revops-comp.md"
invocation: "mekong revops-comp $ARGUMENTS"
description: "Commission calculation and SPIFs"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "943eb2a27215b42c084945674865b2d18f5fa2cbc9337bda67cd311c7b8c0eb5"
---

# /revops-comp

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong revops-comp $ARGUMENTS
```

## Source Command

# /revops:comp — Commission Calc

**IC super command** — Commission calculation and SPIFs

## Pipeline

```
SEQUENTIAL: pull-bookings → apply-plan → calculate-comp → approve
```

## Trigger

Runs recipe `recipes/revops/comp.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/revops:comp [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
