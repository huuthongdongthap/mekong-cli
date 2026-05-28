---
codex-command: "/audit-execute"
source: ".claude/commands/audit-execute.md"
invocation: "mekong audit-execute $ARGUMENTS"
description: "Fieldwork tracking and evidence collection"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "22d6329673dc800ea7888de0bc8396e2215bf55fa105e965f6a49bcb6b3feeb7"
---

# /audit-execute

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong audit-execute $ARGUMENTS
```

## Source Command

# /audit:execute — Audit Execution

**IC super command** — Fieldwork tracking and evidence collection

## Pipeline

```
SEQUENTIAL: assign-fieldwork → collect-evidence → document-findings
    |
OUTPUT: reports/audit/execute/
```

## Trigger

Runs recipe `recipes/audit/execute.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/audit:execute [goal]
```

## Estimated: 3 credits, 12 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
