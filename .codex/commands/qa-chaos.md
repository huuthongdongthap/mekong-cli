---
codex-command: "/qa-chaos"
source: ".claude/commands/qa-chaos.md"
invocation: "mekong qa-chaos $ARGUMENTS"
description: "Chaos engineering — fault injection and resilience testing"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "553eab2652e47c5589256c736756a26f0ed750e70ca3b3c6c53f38f6c720f3c6"
---

# /qa-chaos

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong qa-chaos $ARGUMENTS
```

## Source Command

# /qa:chaos — Chaos Engineering

**IC super command** — Chaos engineering — fault injection and resilience testing

## Pipeline

```
SEQUENTIAL: define-experiments → inject-faults → observe-recovery → report
    |
OUTPUT: reports/qa/chaos/
```

## Trigger

Runs recipe `recipes/qa/chaos.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/qa:chaos [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
