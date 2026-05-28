---
codex-command: "/corpdev-evaluate"
source: ".claude/commands/corpdev-evaluate.md"
invocation: "mekong corpdev-evaluate $ARGUMENTS"
description: "Acqui-hire and acquisition evaluation"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "efe5a007019c5366ad6da38ff137c5e1c18a5a7fba8e55ae4b6c73e66eca03f5"
---

# /corpdev-evaluate

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong corpdev-evaluate $ARGUMENTS
```

## Source Command

# /corpdev:evaluate — Acquisition Eval

**IC super command** — Acqui-hire and acquisition evaluation

## Pipeline

```
PARALLEL: financial-model + team-assess + tech-assess\n    |\nSEQUENTIAL: recommendation
```

## Trigger

Runs recipe `recipes/corpdev/evaluate.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/corpdev:evaluate [goal]
```

## Estimated: 5 credits, 20 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
