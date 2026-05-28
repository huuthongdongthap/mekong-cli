---
codex-command: "/sec-full-audit"
source: ".claude/commands/sec-full-audit.md"
invocation: "mekong sec-full-audit $ARGUMENTS"
description: "Complete security audit — scan, vuln, access review, compliance report"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "28c7df0b14331b24dc00964acb91d59c584b8ea41b85bcc48aad4e1db93cdc16"
---

# /sec-full-audit

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sec-full-audit $ARGUMENTS
```

## Source Command

# /sec:full-audit — Full Security Audit

**Super command** — chains multiple commands via DAG pipeline.

## Pipeline

```
PARALLEL: /sec:scan + /sec:vuln + /sec:access-review
    |
SEQUENTIAL: /sec:compliance-report
    |
OUTPUT: reports/sec/full-audit/
```

## Trigger

Runs recipe `recipes/sec/full-audit.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Spawn parallel subagents via Task tool
3. Wait for all groups to complete
4. Compile into summary report

## Usage

```
/sec:full-audit [goal]
```

## Estimated: 14 credits, 25 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
