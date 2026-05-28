---
codex-command: "/terrain-segment"
source: ".claude/commands/terrain-segment.md"
invocation: "mekong terrain-segment $ARGUMENTS"
description: "Classify market segments using Sun Tzu terrain types"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "03ff781c4bba6490bca4bb7f3b8dd569f1a0bad1ff3b40f457e688c2e7881d92"
---

# /terrain-segment

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong terrain-segment $ARGUMENTS
```

## Source Command

# /terrain:segment — Market Segmentation

**IC super command** — Classify market segments using Sun Tzu terrain types

## Pipeline

```
SEQUENTIAL: identify-segments → classify-terrain → strategic-implications
```

## Trigger

Runs recipe `recipes/terrain/segment.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/terrain:segment [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
