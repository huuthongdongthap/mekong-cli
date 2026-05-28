---
codex-command: "/infra-gateway"
source: ".claude/commands/infra-gateway.md"
invocation: "mekong infra-gateway $ARGUMENTS"
description: "API gateway configuration — routes, auth, rate limiting"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "523faa605b33cee8c00612993ee9d6dd3d85f15e1ebb5494c297b92cb5b2743f"
---

# /infra-gateway

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong infra-gateway $ARGUMENTS
```

## Source Command

# /infra:gateway — API Gateway

**IC super command** — API gateway configuration — routes, auth, rate limiting

## Pipeline

```
SEQUENTIAL: scan-routes → configure-auth → set-rate-limits
```

## Trigger

Runs recipe `recipes/infra/gateway.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/infra:gateway [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
