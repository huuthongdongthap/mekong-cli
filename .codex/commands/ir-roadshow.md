---
codex-command: "/ir-roadshow"
source: ".claude/commands/ir-roadshow.md"
invocation: "mekong ir-roadshow $ARGUMENTS"
description: "Logistics, investor targeting, and presentation versioning"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "f214408947da16b4b898f6d464c03e0486ebc9bde34cf7caa02dc10e7326b6c7"
---

# /ir-roadshow

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ir-roadshow $ARGUMENTS
```

## Source Command

# /ir:roadshow — IR Roadshow

**IC super command** — Logistics, investor targeting, and presentation versioning

## Pipeline

```
SEQUENTIAL: target-investors → schedule-meetings → version-deck
OUTPUT: reports/governance/ir-roadshow/
```

## Trigger

Runs recipe `recipes/ir/roadshow.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/ir:roadshow [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
