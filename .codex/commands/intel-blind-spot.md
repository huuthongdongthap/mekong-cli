---
codex-command: "/intel-blind-spot"
source: ".claude/commands/intel-blind-spot.md"
invocation: "mekong intel-blind-spot $ARGUMENTS"
description: "Identify knowledge gaps and information asymmetries"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "9163c2b31ad0505c8d05daf525969c608598139489f971e2174c342ca93500da"
---

# /intel-blind-spot

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong intel-blind-spot $ARGUMENTS
```

## Source Command

# /intel:blind-spot — Blind Spot Detection

**IC super command** — Identify knowledge gaps and information asymmetries

## Pipeline

```
SEQUENTIAL: map-knowledge → identify-gaps → source-intel
```

## Trigger

Runs recipe `recipes/intel/blind-spot.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/intel:blind-spot [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
