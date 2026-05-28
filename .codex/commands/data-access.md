---
codex-command: "/data-access"
source: ".claude/commands/data-access.md"
invocation: "mekong data-access $ARGUMENTS"
description: "Row-level security and audit logging"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "f74a9700ae7896cc3dc614b09deea14300b6b4f30ec00d99e0becbd1b5d9566e"
---

# /data-access

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong data-access $ARGUMENTS
```

## Source Command

# /data:access — Data Access Control

**IC super command** — Row-level security and audit logging

## Pipeline

```
SEQUENTIAL: scan-policies → enforce-rls → audit-log-report
OUTPUT: reports/data/access/
```

## Trigger

Runs recipe `recipes/data/access.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/data:access [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
