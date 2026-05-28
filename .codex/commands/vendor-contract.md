---
codex-command: "/vendor-contract"
source: ".claude/commands/vendor-contract.md"
invocation: "mekong vendor-contract $ARGUMENTS"
description: "Centralized repository and SLA tracking"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "bcbde60255ba306a70f1985c36dbc1c5fa1966cd96a7ecd4e74740f750ea6f22"
---

# /vendor-contract

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong vendor-contract $ARGUMENTS
```

## Source Command

# /vendor:contract — Vendor Contracts

**IC super command** — Centralized repository and SLA tracking

## Pipeline

```
SEQUENTIAL: import-contract → extract-terms → track-slas
```

## Trigger

Runs recipe `recipes/vendor/contract.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/vendor:contract [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
