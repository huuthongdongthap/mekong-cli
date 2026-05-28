---
codex-command: "/momentum-resource"
source: ".claude/commands/momentum-resource.md"
invocation: "mekong momentum-resource $ARGUMENTS"
description: "Allocate resources by momentum score — invest in winners"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "8bc7f4956617851165c5e2947808202eb25a427d31840e7a5c87a26642a9d7dd"
---

# /momentum-resource

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong momentum-resource $ARGUMENTS
```

## Source Command

# /momentum:resource — Resource Allocation

**IC super command** — Allocate resources by momentum score — invest in winners

## Pipeline

```
SEQUENTIAL: score-projects → rank-by-momentum → allocate-budget
```

## Trigger

Runs recipe `recipes/momentum/resource.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/momentum:resource [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
