---
codex-command: "/ml-deploy"
source: ".claude/commands/ml-deploy.md"
invocation: "mekong ml-deploy $ARGUMENTS"
description: "Model deployment with A/B serving and canary rollouts"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "83076ee88c80b85ba35960e6d42a9ec1decc4f298ea27fc52f49332bb263ca5c"
---

# /ml-deploy

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ml-deploy $ARGUMENTS
```

## Source Command

# /ml:deploy — Model Deploy

**IC super command** — Model deployment with A/B serving and canary rollouts

## Pipeline

```
SEQUENTIAL: package-model → deploy-canary → monitor-metrics → promote
```

## Trigger

Runs recipe `recipes/ml/deploy.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/ml:deploy [goal]
```

## Estimated: 3 credits, 12 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
