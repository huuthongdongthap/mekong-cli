---
codex-command: "/ipo-board-prep"
source: ".claude/commands/ipo-board-prep.md"
invocation: "mekong ipo-board-prep $ARGUMENTS"
description: "Board prep — meeting management, metrics, risk report in parallel, then minutes"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "2866097c7ebb7106e4f27dc1ecb8ff88a67c4c17c90bcd2bb1a15b6f8b9fa22e"
---

# /ipo-board-prep

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ipo-board-prep $ARGUMENTS
```

## Source Command

# /ipo:board-prep — IPO Board Prep

**Super command** — chains multiple commands via DAG pipeline.

## Pipeline

```
PARALLEL: /board:manage + /ir:metrics + /risk:report
    |
SEQUENTIAL: /board:minutes
    |
OUTPUT: reports/ipo/board-prep/
```

## Trigger

Runs recipe `recipes/ipo/board-prep.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Spawn parallel subagents via Task tool
3. Wait for all groups to complete
4. Compile into summary report

## Usage

```
/ipo:board-prep [goal]
```

## Estimated: 11 credits, 30 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
