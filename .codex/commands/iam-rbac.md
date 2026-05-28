---
codex-command: "/iam-rbac"
source: ".claude/commands/iam-rbac.md"
invocation: "mekong iam-rbac $ARGUMENTS"
description: "Role-based access control matrix management"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "2dfb1cc536ba1d56bdc113321d9d59795cfe0589a9d9e141f6e5dca05617d996"
---

# /iam-rbac

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong iam-rbac $ARGUMENTS
```

## Source Command

# /iam:rbac — RBAC Management

**IC super command** — Role-based access control matrix management

## Pipeline

```
SEQUENTIAL: extract-roles → analyze-coverage → update-matrix
    |
OUTPUT: reports/iam/rbac/
```

## Trigger

Runs recipe `recipes/iam/rbac.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/iam:rbac [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
