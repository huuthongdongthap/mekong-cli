---
codex-command: "/pm-feature-flag"
source: ".claude/commands/pm-feature-flag.md"
invocation: "mekong pm-feature-flag $ARGUMENTS"
description: "Progressive rollout and kill switches"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "4ef38af44943ec444ac26721d28e025d8ca905db48d13cfed972698528893723"
---

# /pm-feature-flag

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-feature-flag $ARGUMENTS
```

## Source Command

# /pm:feature-flag — Feature Flags

**IC super command** — Progressive rollout and kill switches

## Pipeline

```
SEQUENTIAL: create-flag → configure-rollout → monitor-metrics
```

## Trigger

Runs recipe `recipes/pm/feature-flag.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/pm:feature-flag [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
