---
codex-command: "/context-compress"
source: ".claude/commands/context-compress.md"
invocation: "mekong context-compress $ARGUMENTS"
description: "Auto-compact and compress context to fit window"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "1e942031074509c1e42453d4c829f72622f34a188ce46d69807e64e2fb7a4828"
---

# /context-compress

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong context-compress $ARGUMENTS
```

## Source Command

# /context:compress — Context Compress

**IC super command** — Auto-compact and compress context to fit window

## Pipeline

```
SEQUENTIAL: summarize-history → prune-stale → verify-coherence
```

## Trigger

Runs recipe `recipes/context/compress.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/context:compress [goal]
```

## Estimated: 2 credits, 5 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
