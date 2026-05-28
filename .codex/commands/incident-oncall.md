---
codex-command: "/incident-oncall"
source: ".claude/commands/incident-oncall.md"
invocation: "mekong incident-oncall $ARGUMENTS"
description: "On-call rotation management and scheduling"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "850cf4c2c2d12ed476286006be6b7120824a7f731ae5973eb3487b489e15ad42"
---

# /incident-oncall

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong incident-oncall $ARGUMENTS
```

## Source Command

# /incident:oncall — On-Call Rotation
**IC super command** — On-call rotation management and scheduling
## Pipeline
```
SEQUENTIAL: define-rotation → assign → notify
```
## Trigger
Runs recipe `recipes/incident/oncall.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/incident:oncall [goal]
```
## Estimated: 2 credits, 5 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
