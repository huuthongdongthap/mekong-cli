---
codex-command: "/it-service"
source: ".claude/commands/it-service.md"
invocation: "mekong it-service $ARGUMENTS"
description: "IT service management — requests, incidents, changes"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "51a3f5c6a8175ff14c776569be2e0e0733d0833af1ef9de6954e3ee0b492ad5e"
---

# /it-service

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong it-service $ARGUMENTS
```

## Source Command

# /it:service — IT Service Management

**IC super command** — IT service management — requests, incidents, changes

## Pipeline

```
SEQUENTIAL: triage-tickets → prioritize → assign
    |
OUTPUT: reports/it/service/
```

## Trigger

Runs recipe `recipes/it/service.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/it:service [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
