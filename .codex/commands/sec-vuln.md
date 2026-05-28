---
codex-command: "/sec-vuln"
source: ".claude/commands/sec-vuln.md"
invocation: "mekong sec-vuln $ARGUMENTS"
description: "Vulnerability management lifecycle"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "e2d8dbc58343056bf6558295f9d79c39f7c38a1f7545679c999d3dfd522a04e9"
---

# /sec-vuln

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sec-vuln $ARGUMENTS
```

## Source Command

# /sec:vuln — Vulnerability Management

**IC super command** — Vulnerability management lifecycle

## Pipeline

```
SEQUENTIAL: scan → prioritize → assign-sla → track
    |
OUTPUT: reports/sec/vuln/
```

## Trigger

Runs recipe `recipes/sec/vuln.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/sec:vuln [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
