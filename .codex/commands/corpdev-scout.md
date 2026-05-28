---
codex-command: "/corpdev-scout"
source: ".claude/commands/corpdev-scout.md"
invocation: "mekong corpdev-scout $ARGUMENTS"
description: "M&A target identification"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "be2ef44817bbf6406dcb2c266ebc7ec2867a093507a33c737d1273476ffe0ca4"
---

# /corpdev-scout

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong corpdev-scout $ARGUMENTS
```

## Source Command

# /corpdev:scout — M&A Scout

**IC super command** — M&A target identification

## Pipeline

```
SEQUENTIAL: define-criteria → scan-market → shortlist
```

## Trigger

Runs recipe `recipes/corpdev/scout.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/corpdev:scout [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
