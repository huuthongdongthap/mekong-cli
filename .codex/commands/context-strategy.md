---
codex-command: "/context-strategy"
source: ".claude/commands/context-strategy.md"
invocation: "mekong context-strategy $ARGUMENTS"
description: "Context window management — what to keep, compress, or drop"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "ca04c2e585986b54cb968bed651a75af99dac893bb6cc1562a217de1d80b5067"
---

# /context-strategy

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong context-strategy $ARGUMENTS
```

## Source Command

# /context:strategy — Context Strategy

**IC super command** — Context window management — what to keep, compress, or drop

## Pipeline

```
SEQUENTIAL: analyze-usage → classify-priority → optimize-allocation
```

## Trigger

Runs recipe `recipes/context/strategy.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/context:strategy [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
