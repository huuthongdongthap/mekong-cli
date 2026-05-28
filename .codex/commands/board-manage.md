---
codex-command: "/board-manage"
source: ".claude/commands/board-manage.md"
invocation: "mekong board-manage $ARGUMENTS"
description: "Meeting scheduling, agenda, and materials preparation"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "89dfe26e05ec9e145e14b87aaa9e4601d602d2c2374aeffca8dc838487772eae"
---

# /board-manage

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong board-manage $ARGUMENTS
```

## Source Command

# /board:manage — Board Management

**IC super command** — Meeting scheduling, agenda, and materials preparation

## Pipeline

```
SEQUENTIAL: schedule-meeting → prepare-agenda → distribute-materials
OUTPUT: reports/governance/board-manage/
```

## Trigger

Runs recipe `recipes/board/manage.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/board:manage [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
