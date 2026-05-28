---
codex-command: "/board-minutes"
source: ".claude/commands/board-minutes.md"
invocation: "mekong board-minutes $ARGUMENTS"
description: "Meeting minutes and action item tracking"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "4f54de6a3ac0d4ffc4995af74827ce78ae24a2cb10b54ac2b233c2110d88890d"
---

# /board-minutes

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong board-minutes $ARGUMENTS
```

## Source Command

# /board:minutes — Board Minutes

**IC super command** — Meeting minutes and action item tracking

## Pipeline

```
SEQUENTIAL: draft-minutes → track-action-items → distribute
OUTPUT: reports/governance/board-minutes/
```

## Trigger

Runs recipe `recipes/board/minutes.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/board:minutes [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
