---
codex-command: "/ir-narrative"
source: ".claude/commands/ir-narrative.md"
invocation: "mekong ir-narrative $ARGUMENTS"
description: "S-1 narrative development — investment thesis and MD&A"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "95e8920b646ed357afc4853a5dd8366a44a8a22f3c6f2ace2eb247c7a8abcd12"
---

# /ir-narrative

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ir-narrative $ARGUMENTS
```

## Source Command

# /ir:narrative — S-1 Narrative

**IC super command** — S-1 narrative development — investment thesis and MD&A

## Pipeline

```
SEQUENTIAL: draft-thesis → write-mda → legal-review
OUTPUT: reports/governance/ir-narrative/
```

## Trigger

Runs recipe `recipes/ir/narrative.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/ir:narrative [goal]
```

## Estimated: 5 credits, 20 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
