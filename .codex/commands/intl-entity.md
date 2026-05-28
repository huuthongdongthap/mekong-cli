---
codex-command: "/intl-entity"
source: ".claude/commands/intl-entity.md"
invocation: "mekong intl-entity $ARGUMENTS"
description: "International entity setup and tax structuring"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "2e26630cc0c6bd1626e0f654aac71776b28a4a4f4e8e629d8b1dfea27d2b1ae8"
---

# /intl-entity

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong intl-entity $ARGUMENTS
```

## Source Command

# /intl:entity — International Entity

**IC super command** — International entity setup and tax structuring

## Pipeline

```
SEQUENTIAL: select-structure → register-entity → setup-banking → tax-plan
```

## Trigger

Runs recipe `recipes/intl/entity.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/intl:entity [goal]
```

## Estimated: 3 credits, 12 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
