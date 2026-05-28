---
codex-command: "/iam-review"
source: ".claude/commands/iam-review.md"
invocation: "mekong iam-review $ARGUMENTS"
description: "Quarterly access recertification with evidence"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "7384d30ab6ddbbd2da99a90351f01c16bd1c0901ae4d0a5ca6fc66d252180436"
---

# /iam-review

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong iam-review $ARGUMENTS
```

## Source Command

# /iam:review — Access Recertification

**IC super command** — Quarterly access recertification with evidence

## Pipeline

```
PARALLEL: extract-entitlements + collect-managers
    |
SEQUENTIAL: certify → remediate-exceptions
    |
OUTPUT: reports/iam/review/
```

## Trigger

Runs recipe `recipes/iam/review.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/iam:review [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
