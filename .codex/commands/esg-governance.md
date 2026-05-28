---
codex-command: "/esg-governance"
source: ".claude/commands/esg-governance.md"
invocation: "mekong esg-governance $ARGUMENTS"
description: "ESG governance framework maintenance"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d076487b567f69fcfcbc72068edcd9a77dc820132967ca29ac0492a57edee7dd"
---

# /esg-governance

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong esg-governance $ARGUMENTS
```

## Source Command

# /esg:governance — ESG Governance

**IC super command** — ESG governance framework maintenance

## Pipeline

```
SEQUENTIAL: review-framework → update-policies → board-oversight
```

## Trigger

Runs recipe `recipes/esg/governance.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/esg:governance [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
