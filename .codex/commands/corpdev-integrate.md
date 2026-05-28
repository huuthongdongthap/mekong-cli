---
codex-command: "/corpdev-integrate"
source: ".claude/commands/corpdev-integrate.md"
invocation: "mekong corpdev-integrate $ARGUMENTS"
description: "Post-acquisition integration playbook"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "7f122caa10d095647651ba73df6b0861a73da210b2bf1d324fc5435880a418b1"
---

# /corpdev-integrate

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong corpdev-integrate $ARGUMENTS
```

## Source Command

# /corpdev:integrate — Post-Acquisition

**IC super command** — Post-acquisition integration playbook

## Pipeline

```
SEQUENTIAL: day-1-plan → 30-day-milestones → 90-day-milestones → track
```

## Trigger

Runs recipe `recipes/corpdev/integrate.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/corpdev:integrate [goal]
```

## Estimated: 3 credits, 12 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
