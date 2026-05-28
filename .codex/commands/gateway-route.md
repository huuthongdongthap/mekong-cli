---
codex-command: "/gateway-route"
source: ".claude/commands/gateway-route.md"
invocation: "mekong gateway-route $ARGUMENTS"
description: "API gateway route configuration and management"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "1cfb544815b27fb28f94f7c446615b870248e52a96a8a14440eb495e4d656f75"
---

# /gateway-route

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong gateway-route $ARGUMENTS
```

## Source Command

# /gateway:route — Route Config
**IC super command** — API gateway route configuration and management
## Pipeline
```
SEQUENTIAL: scan-openapi → generate-routes → deploy
```
## Trigger
Runs recipe `recipes/gateway/route.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/gateway:route [goal]
```
## Estimated: 2 credits, 8 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
