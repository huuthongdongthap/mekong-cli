---
codex-command: "/board-compliance"
source: ".claude/commands/board-compliance.md"
invocation: "mekong board-compliance $ARGUMENTS"
description: "Committee composition tracking vs exchange rules"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "a8946e95d1a9e723700a0c4ded88be288b9c1a162ec553abf3868012c5d9ae29"
---

# /board-compliance

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong board-compliance $ARGUMENTS
```

## Source Command

# /board:compliance — Board Compliance

**IC super command** — Committee composition tracking vs exchange rules

## Pipeline

```
SEQUENTIAL: extract-composition → check-requirements → gap-report
OUTPUT: reports/governance/board-compliance/
```

## Trigger

Runs recipe `recipes/board/compliance.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/board:compliance [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
