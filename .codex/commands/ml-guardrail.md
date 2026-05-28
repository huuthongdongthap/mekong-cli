---
codex-command: "/ml-guardrail"
source: ".claude/commands/ml-guardrail.md"
invocation: "mekong ml-guardrail $ARGUMENTS"
description: "Content safety, output validation, fallback mechanisms"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "bdb1fc168403059d8f3941bb897101c500dbe819825479e7bff8e79836cbcb22"
---

# /ml-guardrail

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ml-guardrail $ARGUMENTS
```

## Source Command

# /ml:guardrail — AI Guardrails

**IC super command** — Content safety, output validation, fallback mechanisms

## Pipeline

```
SEQUENTIAL: define-rules → test-guardrails → deploy-filters
```

## Trigger

Runs recipe `recipes/ml/guardrail.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/ml:guardrail [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
