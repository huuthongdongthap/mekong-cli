---
codex-command: "/devrel-onboard"
source: ".claude/commands/devrel-onboard.md"
invocation: "mekong devrel-onboard $ARGUMENTS"
description: "Time-to-first-success tracking"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "4cef1b279f03406d279af552f72faa36bc0390edfbbddb2d3e3172dd2dd47bef"
---

# /devrel-onboard

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong devrel-onboard $ARGUMENTS
```

## Source Command

# /devrel:onboard — Developer Onboard

**IC super command** — Time-to-first-success tracking

## Pipeline

```
SEQUENTIAL: setup-sandbox → guided-tutorial → track-ttfs
```

## Trigger

Runs recipe `recipes/devrel/onboard.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/devrel:onboard [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
