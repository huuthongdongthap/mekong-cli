---
codex-command: "/intl-localize"
source: ".claude/commands/intl-localize.md"
invocation: "mekong intl-localize $ARGUMENTS"
description: "i18n pipeline and translation management"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "29a873bc894dc94a1b53b36477b95c0c9dd9ef6a9ae6eac5b47023fba622187f"
---

# /intl-localize

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong intl-localize $ARGUMENTS
```

## Source Command

# /intl:localize — Localization

**IC super command** — i18n pipeline and translation management

## Pipeline

```
SEQUENTIAL: extract-strings → translate → review → deploy
```

## Trigger

Runs recipe `recipes/intl/localize.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/intl:localize [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
