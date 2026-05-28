---
codex-command: "/momentum-viral-loop"
source: ".claude/commands/momentum-viral-loop.md"
invocation: "mekong momentum-viral-loop $ARGUMENTS"
description: "Design and measure viral loops — K-factor, cycle time"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d4bf8773530752bee8f29ca6b0cf49b313aab5707e419b2f73cf14825a796152"
---

# /momentum-viral-loop

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong momentum-viral-loop $ARGUMENTS
```

## Source Command

# /momentum:viral-loop — Viral Loop Design

**IC super command** — Design and measure viral loops — K-factor, cycle time

## Pipeline

```
SEQUENTIAL: map-loop → measure-k-factor → optimize
```

## Trigger

Runs recipe `recipes/momentum/viral-loop.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/momentum:viral-loop [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
