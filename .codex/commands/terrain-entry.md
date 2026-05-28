---
codex-command: "/terrain-entry"
source: ".claude/commands/terrain-entry.md"
invocation: "mekong terrain-entry $ARGUMENTS"
description: "Market entry strategy per terrain classification"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d5b5a8e90b4818220888a1895076ed6dfb3fc878dc50b6af4f758398a1a4ff05"
---

# /terrain-entry

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong terrain-entry $ARGUMENTS
```

## Source Command

# /terrain:entry — Market Entry

**IC super command** — Market entry strategy per terrain classification

## Pipeline

```
SEQUENTIAL: assess-terrain → choose-entry-mode → execution-plan
```

## Trigger

Runs recipe `recipes/terrain/entry.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/terrain:entry [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
