---
codex-command: "/iam-sod"
source: ".claude/commands/iam-sod.md"
invocation: "mekong iam-sod $ARGUMENTS"
description: "Segregation of duties violation detection"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "a93244e3dfe6db4445bae7b8ae12fd74c2774f5bb2b2c9ef571ad40b04386962"
---

# /iam-sod

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong iam-sod $ARGUMENTS
```

## Source Command

# /iam:sod — SoD Detection

**IC super command** — Segregation of duties violation detection

## Pipeline

```
SEQUENTIAL: analyze-sod-violations → generate-report
    |
OUTPUT: reports/iam/sod/
```

## Trigger

Runs recipe `recipes/iam/sod.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/iam:sod [goal]
```

## Estimated: 2 credits, 5 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
