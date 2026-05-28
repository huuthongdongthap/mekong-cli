---
codex-command: "/gateway-rate-limit"
source: ".claude/commands/gateway-rate-limit.md"
invocation: "mekong gateway-rate-limit $ARGUMENTS"
description: "Rate limit rule configuration per tier"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "3dc46480bec91daa86f9d4179fb1a0c0c79b417b03fc756335a73c270a401ca0"
---

# /gateway-rate-limit

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong gateway-rate-limit $ARGUMENTS
```

## Source Command

# /gateway:rate-limit — Rate Limiting
**IC super command** — Rate limit rule configuration per tier
## Pipeline
```
SEQUENTIAL: define-tiers → set-limits → monitor
```
## Trigger
Runs recipe `recipes/gateway/rate-limit.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/gateway:rate-limit [goal]
```
## Estimated: 2 credits, 5 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
