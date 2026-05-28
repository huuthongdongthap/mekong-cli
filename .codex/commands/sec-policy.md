---
codex-command: "/sec-policy"
source: ".claude/commands/sec-policy.md"
invocation: "mekong sec-policy $ARGUMENTS"
description: "Policy-as-code enforcement"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "f095e80a83526e3a802126532edb70542acccc2d600962e9359336aa386ac10b"
---

# /sec-policy

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sec-policy $ARGUMENTS
```

## Source Command

# /sec:policy — Policy Enforcement

**IC super command** — Policy-as-code enforcement

## Pipeline

```
SEQUENTIAL: policy-scan → drift-detect → enforce
    |
OUTPUT: reports/sec/policy/
```

## Trigger

Runs recipe `recipes/sec/policy.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/sec:policy [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
