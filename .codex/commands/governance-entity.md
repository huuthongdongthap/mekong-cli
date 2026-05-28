---
codex-command: "/governance-entity"
source: ".claude/commands/governance-entity.md"
invocation: "mekong governance-entity $ARGUMENTS"
description: "Subsidiaries, cap table, D&O insurance tracking"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "eb4e10cdc86736ef0f1f721c92d5b63f0539152098604bc17e57bd14703468ca"
---

# /governance-entity

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong governance-entity $ARGUMENTS
```

## Source Command

# /governance:entity — Entity Management

**IC super command** — Subsidiaries, cap table, D&O insurance tracking

## Pipeline

```
PARALLEL: entity-inventory + cap-table-sync
    |
SEQUENTIAL: insurance-review
OUTPUT: reports/governance/entity/
```

## Trigger

Runs recipe `recipes/governance/entity.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/governance:entity [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
