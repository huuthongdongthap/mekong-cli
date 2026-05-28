---
codex-command: "/ml-governance"
source: ".claude/commands/ml-governance.md"
invocation: "mekong ml-governance $ARGUMENTS"
description: "Audit trail, EU AI Act compliance, model cards"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "3b5909151c7a780cf69b9359c2ab86382a7f61a3af558555b2b0ab79e7bedc80"
---

# /ml-governance

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ml-governance $ARGUMENTS
```

## Source Command

# /ml:governance — AI Governance

**IC super command** — Audit trail, EU AI Act compliance, model cards

## Pipeline

```
SEQUENTIAL: generate-model-card → audit-trail → compliance-check
```

## Trigger

Runs recipe `recipes/ml/governance.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/ml:governance [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
