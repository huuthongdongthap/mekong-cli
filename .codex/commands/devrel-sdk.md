---
codex-command: "/devrel-sdk"
source: ".claude/commands/devrel-sdk.md"
invocation: "mekong devrel-sdk $ARGUMENTS"
description: "SDK publishing and compatibility matrix"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "218377510c2b1d3feaafc1632f146e0d8be3894025d9f23b20641496609b5342"
---

# /devrel-sdk

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong devrel-sdk $ARGUMENTS
```

## Source Command

# /devrel:sdk — SDK Publishing

**IC super command** — SDK publishing and compatibility matrix

## Pipeline

```
SEQUENTIAL: build-sdks → test-compat → publish
```

## Trigger

Runs recipe `recipes/devrel/sdk.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/devrel:sdk [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
