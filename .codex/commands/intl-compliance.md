---
codex-command: "/intl-compliance"
source: ".claude/commands/intl-compliance.md"
invocation: "mekong intl-compliance $ARGUMENTS"
description: "Country-specific regulatory requirements"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d7c33039d489191b16e67b2e7adf6dd75b6f03c854abf0255c891881b9f257da"
---

# /intl-compliance

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong intl-compliance $ARGUMENTS
```

## Source Command

# /intl:compliance — Country Compliance

**IC super command** — Country-specific regulatory requirements

## Pipeline

```
SEQUENTIAL: identify-regs → gap-analysis → remediation-plan
```

## Trigger

Runs recipe `recipes/intl/compliance.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/intl:compliance [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
