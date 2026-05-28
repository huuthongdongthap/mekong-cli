---
codex-command: "/sec-incident"
source: ".claude/commands/sec-incident.md"
invocation: "mekong sec-incident $ARGUMENTS"
description: "Security incident response workflow"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "ee9a19094252d9dec9e9c6b574bf221a8cc97c13b6c0abdd7fdf2a13d5a232f1"
---

# /sec-incident

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sec-incident $ARGUMENTS
```

## Source Command

# /sec:incident — Incident Response

**IC super command** — Security incident response workflow

## Pipeline

```
PARALLEL: detect + triage
    |
SEQUENTIAL: contain → remediate → postmortem
    |
OUTPUT: reports/sec/incident/
```

## Trigger

Runs recipe `recipes/sec/incident.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/sec:incident [goal]
```

## Estimated: 5 credits, 15 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
