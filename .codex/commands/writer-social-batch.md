---
codex-command: "/writer-social-batch"
source: ".claude/commands/writer-social-batch.md"
invocation: "mekong writer-social-batch $ARGUMENTS"
description: "Social batch — 7-day posts + posting schedule in parallel. 2 commands, ~10 min."
argument-hint: "[brand-or-content-theme]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "02021984412d49a518eacd57f068600d3bc739ac7edd90ebdf50b98e0dea0464"
---

# /writer-social-batch

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong writer-social-batch $ARGUMENTS
```

## Source Command

# /writer:social-batch — Social Batch

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
PARALLEL: /social --batch 7 + /schedule --social
    |
OUTPUT: reports/writer/social/
        7-day-posts.md
        posting-schedule.md
        SOCIAL-BATCH-SUMMARY.md
```

## Trigger

Runs recipe `recipes/writer/writer-social-batch.json` through DAGScheduler.

## Execution

1. Read recipe DAG definition
2. Spawn both subagents simultaneously via Task tool (mode: parallel)
3. Wait for both to complete
4. Compile into SOCIAL-BATCH-SUMMARY.md as content calendar with copy and optimal send times

## Usage

```
/writer:social-batch [brand-or-content-theme]
```

## Estimated: 5 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
