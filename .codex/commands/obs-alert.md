---
codex-command: "/obs-alert"
source: ".claude/commands/obs-alert.md"
invocation: "mekong obs-alert $ARGUMENTS"
description: "Alert rule creation, routing, and silencing"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "bdf6eed40562d17bd9cce35a1348fb1f0cb2c2a780103dd5b6d3a3d3dbf08665"
---

# /obs-alert

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong obs-alert $ARGUMENTS
```

## Source Command

# /obs:alert — Alert Management
**IC super command** — Alert rule creation, routing, and silencing
## Pipeline
```
SEQUENTIAL: list-rules → evaluate → route
```
## Trigger
Runs recipe `recipes/obs/alert.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/obs:alert [goal]
```
## Estimated: 2 credits, 5 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
