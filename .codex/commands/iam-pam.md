---
codex-command: "/iam-pam"
source: ".claude/commands/iam-pam.md"
invocation: "mekong iam-pam $ARGUMENTS"
description: "Privileged access management with JIT elevation"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "8b3d4bb0881b3a9c75456a5984058bd2ce38063c1343031d7915d2161ed99e27"
---

# /iam-pam

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong iam-pam $ARGUMENTS
```

## Source Command

# /iam:pam — Privileged Access

**IC super command** — Privileged access management with JIT elevation

## Pipeline

```
SEQUENTIAL: scan-privileged → enforce-jit → audit-log
    |
OUTPUT: reports/iam/pam/
```

## Trigger

Runs recipe `recipes/iam/pam.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/iam:pam [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
