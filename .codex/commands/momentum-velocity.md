---
codex-command: "/momentum-velocity"
source: ".claude/commands/momentum-velocity.md"
invocation: "mekong momentum-velocity $ARGUMENTS"
description: "Track MRR growth rate, user acquisition speed, feature ship rate"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "4706b2573c51bbd7eba7ccfd86109fb3c3194eb4dac653c1ff30c6e02830a41c"
---

# /momentum-velocity

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong momentum-velocity $ARGUMENTS
```

## Source Command

# /momentum:velocity — Scaling Velocity

**IC super command** — Track MRR growth rate, user acquisition speed, feature ship rate

## Pipeline

```
SEQUENTIAL: pull-metrics → calculate-velocity → trend-report
```

## Trigger

Runs recipe `recipes/momentum/velocity.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/momentum:velocity [goal]
```

## Estimated: 3 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
