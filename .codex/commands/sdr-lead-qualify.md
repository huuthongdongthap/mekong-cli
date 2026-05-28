---
codex-command: "/sdr-lead-qualify"
source: ".claude/commands/sdr-lead-qualify.md"
invocation: "mekong sdr-lead-qualify $ARGUMENTS"
description: "Lead qualify & handoff — score lead then prep AE handoff brief. 2 commands, ~8 min."
argument-hint: "[lead-name-or-company]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "933501c2661b8e4c89d6c8d60e4bdf1b3643347b55cf04e24164dfab1f0d6383"
---

# /sdr-lead-qualify

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sdr-lead-qualify $ARGUMENTS
```

## Source Command

# /sdr:lead-qualify — Lead Qualify & Handoff

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
SEQUENTIAL: /customer-research --qualify
    |
SEQUENTIAL: /pipeline --handoff
    |
OUTPUT: reports/sdr/qualify/
        qualification-scorecard.md
        ae-handoff-brief.md
        QUALIFY-SUMMARY.md
```

## Trigger

Runs recipe `recipes/sdr/sdr-lead-qualify.json` through DAGScheduler.

## Execution

1. Read recipe DAG definition
2. Run /customer-research --qualify first (mode: sequential)
3. Run /pipeline --handoff using qualification output as context
4. Compile into QUALIFY-SUMMARY.md with BANT analysis and AE brief

## Usage

```
/sdr:lead-qualify [lead-name-or-company]
```

## Estimated: 5 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
