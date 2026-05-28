---
codex-command: "/intel-asymmetry"
source: ".claude/commands/intel-asymmetry.md"
invocation: "mekong intel-asymmetry $ARGUMENTS"
description: "Exploit information asymmetry for competitive advantage"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "6bca016ed45fb1588c682c068b8893fd0aea9c1d8d32df239b59fd3d5c70979d"
---

# /intel-asymmetry

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong intel-asymmetry $ARGUMENTS
```

## Source Command

# /intel:asymmetry — Info Asymmetry

**IC super command** — Exploit information asymmetry for competitive advantage

## Pipeline

```
SEQUENTIAL: assess-advantage → identify-levers → action-plan
```

## Trigger

Runs recipe `recipes/intel/asymmetry.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/intel:asymmetry [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
