---
codex-command: "/ml-eval"
source: ".claude/commands/ml-eval.md"
invocation: "mekong ml-eval $ARGUMENTS"
description: "Prompt regression testing and semantic evaluation"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "5b7ae06cdc9873af290250e22693485ed682b2f7fb482b20f81b7c0ace230547"
---

# /ml-eval

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ml-eval $ARGUMENTS
```

## Source Command

# /ml:eval — Prompt Evaluation

**IC super command** — Prompt regression testing and semantic evaluation

## Pipeline

```
SEQUENTIAL: load-suite → run-evals → compare-baseline → report
```

## Trigger

Runs recipe `recipes/ml/eval.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/ml:eval [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
