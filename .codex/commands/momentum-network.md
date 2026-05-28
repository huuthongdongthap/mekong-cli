---
codex-command: "/momentum-network"
source: ".claude/commands/momentum-network.md"
invocation: "mekong momentum-network $ARGUMENTS"
description: "Network effect analysis — density, clustering, value curves"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d7cb7c7571ba431e9a5395d334ed2054fe176e0e6745ff523585b104357fb973"
---

# /momentum-network

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong momentum-network $ARGUMENTS
```

## Source Command

# /momentum:network — Network Effects

**IC super command** — Network effect analysis — density, clustering, value curves

## Pipeline

```
SEQUENTIAL: graph-analysis → value-curve → defensibility-score
```

## Trigger

Runs recipe `recipes/momentum/network.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/momentum:network [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
