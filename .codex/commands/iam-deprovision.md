---
codex-command: "/iam-deprovision"
source: ".claude/commands/iam-deprovision.md"
invocation: "mekong iam-deprovision $ARGUMENTS"
description: "Immediate access revocation on termination"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "b3fd72a49ec0f6abddc97b0a60a5810216d58f2e65b69a1cc7a2910b7d575c65"
---

# /iam-deprovision

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong iam-deprovision $ARGUMENTS
```

## Source Command

# /iam:deprovision — Access Revocation

**IC super command** — Immediate access revocation on termination

## Pipeline

```
SEQUENTIAL: revoke-all-access → archive-data → generate-evidence
    |
OUTPUT: reports/iam/deprovision/
```

## Trigger

Runs recipe `recipes/iam/deprovision.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/iam:deprovision [goal]
```

## Estimated: 2 credits, 5 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
