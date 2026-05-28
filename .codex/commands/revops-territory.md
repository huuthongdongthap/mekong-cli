---
codex-command: "/revops-territory"
source: ".claude/commands/revops-territory.md"
invocation: "mekong revops-territory $ARGUMENTS"
description: "Territory planning and quota allocation"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "ea5d4229367f7282ffa711cebafd69dd0eaf7e36d53daf09c585e01ef180c44a"
---

# /revops-territory

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong revops-territory $ARGUMENTS
```

## Source Command

# /revops:territory — Territory Planning

**IC super command** — Territory planning and quota allocation

## Pipeline

```
SEQUENTIAL: segment-market → assign-territories → set-quotas
```

## Trigger

Runs recipe `recipes/revops/territory.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/revops:territory [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
