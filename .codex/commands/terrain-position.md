---
codex-command: "/terrain-position"
source: ".claude/commands/terrain-position.md"
invocation: "mekong terrain-position $ARGUMENTS"
description: "Competitive positioning analysis per terrain type"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "9a2f97a796824df1fc711ddd6a28fc8c5ba7c4759af58d65e3fd92a66d34d408"
---

# /terrain-position

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong terrain-position $ARGUMENTS
```

## Source Command

# /terrain:position — Competitive Position

**IC super command** — Competitive positioning analysis per terrain type

## Pipeline

```
SEQUENTIAL: map-competitors → assess-position → recommend-moves
```

## Trigger

Runs recipe `recipes/terrain/position.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/terrain:position [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
