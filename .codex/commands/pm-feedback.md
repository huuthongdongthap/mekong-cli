---
codex-command: "/pm-feedback"
source: ".claude/commands/pm-feedback.md"
invocation: "mekong pm-feedback $ARGUMENTS"
description: "User feedback collection routed to backlog"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "8322818cda2a71d80e83b8a6f7ab658754b0eef0ccf2b9b3db623110246e0b41"
---

# /pm-feedback

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-feedback $ARGUMENTS
```

## Source Command

# /pm:feedback — User Feedback

**IC super command** — User feedback collection routed to backlog

## Pipeline

```
SEQUENTIAL: collect-feedback → categorize → route-to-backlog
```

## Trigger

Runs recipe `recipes/pm/feedback.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/pm:feedback [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
