---
codex-command: "/sec-audit"
source: ".claude/commands/sec-audit.md"
invocation: "mekong sec-audit $ARGUMENTS"
description: "Continuous compliance monitoring (SOC2/ISO27001)"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "07c546fe833453c8547cfa496332f40df7a5d198877101877c7d756b759b8241"
---

# /sec-audit

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sec-audit $ARGUMENTS
```

## Source Command

# /sec:audit — Compliance Audit

**IC super command** — Continuous compliance monitoring (SOC2/ISO27001)

## Pipeline

```
SEQUENTIAL: evidence-collect → gap-analyze → remediation-plan
    |
OUTPUT: reports/sec/audit/
```

## Trigger

Runs recipe `recipes/sec/audit.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/sec:audit [goal]
```

## Estimated: 5 credits, 20 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
