---
codex-command: "/pm-competitor"
source: ".claude/commands/pm-competitor.md"
invocation: "mekong pm-competitor $ARGUMENTS"
description: "Competitive intelligence tracking"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "99e9f2a4e7b86a783e497b2510d9a3fcb7e14264940d731a228594f86255ab77"
---

# /pm-competitor

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-competitor $ARGUMENTS
```

## Source Command

# /pm:competitor — Competitive Intel

**IC super command** — Competitive intelligence tracking

## Pipeline

```
SEQUENTIAL: scan-competitors → analyze-features → gap-report
```

## Trigger

Runs recipe `recipes/pm/competitor.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/pm:competitor [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
