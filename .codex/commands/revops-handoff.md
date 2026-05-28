---
codex-command: "/revops-handoff"
source: ".claude/commands/revops-handoff.md"
invocation: "mekong revops-handoff $ARGUMENTS"
description: "SLA-governed lead and opportunity handoff"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "f2e44afa7f777d19afa30d7624911af04fb815e37618ff0471f4e921126ff9aa"
---

# /revops-handoff

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong revops-handoff $ARGUMENTS
```

## Source Command

# /revops:handoff — Lead Handoff

**IC super command** — SLA-governed lead and opportunity handoff

## Pipeline

```
SEQUENTIAL: qualify-lead → match-ae → handoff → track-sla
```

## Trigger

Runs recipe `recipes/revops/handoff.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/revops:handoff [goal]
```

## Estimated: 2 credits, 5 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
