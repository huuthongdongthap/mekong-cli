---
codex-command: "/it-endpoint"
source: ".claude/commands/it-endpoint.md"
invocation: "mekong it-endpoint $ARGUMENTS"
description: "Device compliance and encryption verification"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "5a7587723eea0e36311c262a580112663315656d7e33c3d37017a446291b5847"
---

# /it-endpoint

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong it-endpoint $ARGUMENTS
```

## Source Command

# /it:endpoint — Endpoint Compliance

**IC super command** — Device compliance and encryption verification

## Pipeline

```
SEQUENTIAL: check-compliance → verify-encryption → report
    |
OUTPUT: reports/it/endpoint/
```

## Trigger

Runs recipe `recipes/it/endpoint.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/it:endpoint [goal]
```

## Estimated: 2 credits, 5 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
