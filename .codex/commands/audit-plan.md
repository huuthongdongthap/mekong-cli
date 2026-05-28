---
codex-command: "/audit-plan"
source: ".claude/commands/audit-plan.md"
invocation: "mekong audit-plan $ARGUMENTS"
description: "Risk-based audit planning"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "1dcd1ebd436944d051f52179d02d960cb3906de424b949411c423217155fbb2f"
---

# /audit-plan

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong audit-plan $ARGUMENTS
```

## Source Command

# /audit:plan — Audit Planning

**IC super command** — Risk-based audit planning

## Pipeline

```
SEQUENTIAL: risk-rank → select-audits → allocate-resources
    |
OUTPUT: reports/audit/plan/
```

## Trigger

Runs recipe `recipes/audit/plan.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/audit:plan [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
