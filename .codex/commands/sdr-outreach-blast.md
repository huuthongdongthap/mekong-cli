---
codex-command: "/sdr-outreach-blast"
source: ".claude/commands/sdr-outreach-blast.md"
invocation: "mekong sdr-outreach-blast $ARGUMENTS"
description: "Outreach blast — cold emails + LinkedIn messages in parallel. 2 commands, ~8 min."
argument-hint: "[lead-list-or-target-persona]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "1489790c0b02f1050a5b7fdf4609a32f9391736b5e27379487c747666f0a9c08"
---

# /sdr-outreach-blast

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sdr-outreach-blast $ARGUMENTS
```

## Source Command

# /sdr:outreach-blast — Outreach Blast

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
PARALLEL: /email --cold-outreach + /social --linkedin
    |
OUTPUT: reports/sdr/outreach/
        cold-emails.md
        linkedin-messages.md
        OUTREACH-SUMMARY.md
```

## Trigger

Runs recipe `recipes/sdr/sdr-outreach-blast.json` through DAGScheduler.

## Execution

1. Read recipe DAG definition
2. Spawn both subagents simultaneously via Task tool (mode: parallel)
3. Wait for both to complete
4. Compile outputs into OUTREACH-SUMMARY.md with send-ready package

## Usage

```
/sdr:outreach-blast [lead-list-or-target-persona]
```

## Estimated: 5 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
