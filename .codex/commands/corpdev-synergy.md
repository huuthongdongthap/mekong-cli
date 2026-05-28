---
codex-command: "/corpdev-synergy"
source: ".claude/commands/corpdev-synergy.md"
invocation: "mekong corpdev-synergy $ARGUMENTS"
description: "Synergy tracking and integration milestones"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "7c46a3cc4175f21991135238e3066cfa7a74b04e5f1583970c84b8f02b36e4f5"
---

# /corpdev-synergy

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong corpdev-synergy $ARGUMENTS
```

## Source Command

# /corpdev:synergy — Synergy Tracking

**IC super command** — Synergy tracking and integration milestones

## Pipeline

```
SEQUENTIAL: identify-synergies → track-realization → report
```

## Trigger

Runs recipe `recipes/corpdev/synergy.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/corpdev:synergy [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
