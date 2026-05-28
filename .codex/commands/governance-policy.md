---
codex-command: "/governance-policy"
source: ".claude/commands/governance-policy.md"
invocation: "mekong governance-policy $ARGUMENTS"
description: "Code of ethics, whistleblower, corporate guidelines"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "4d027730a2f9a0a999d86225a8f6e33929a90f6671ca7d33b71037e3674e5866"
---

# /governance-policy

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong governance-policy $ARGUMENTS
```

## Source Command

# /governance:policy — Corporate Policy

**IC super command** — Code of ethics, whistleblower, corporate guidelines

## Pipeline

```
SEQUENTIAL: draft-policies → legal-review → publish-distribute
OUTPUT: reports/governance/policy/
```

## Trigger

Runs recipe `recipes/governance/policy.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/governance:policy [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
