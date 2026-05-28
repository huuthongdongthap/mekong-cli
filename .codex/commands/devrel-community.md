---
codex-command: "/devrel-community"
source: ".claude/commands/devrel-community.md"
invocation: "mekong devrel-community $ARGUMENTS"
description: "Discord/forum management and engagement metrics"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "1c4340c3a2969d5d0d20c0160dc46db01955e5c4debb8803e562a392584c539d"
---

# /devrel-community

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong devrel-community $ARGUMENTS
```

## Source Command

# /devrel:community — Community Management

**IC super command** — Discord/forum management and engagement metrics

## Pipeline

```
PARALLEL: discord-stats + forum-stats\n    |\nSEQUENTIAL: engagement-report
```

## Trigger

Runs recipe `recipes/devrel/community.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/devrel:community [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
