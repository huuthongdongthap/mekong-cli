---
codex-command: "/workflow-trigger"
source: ".claude/commands/workflow-trigger.md"
invocation: "mekong workflow-trigger $ARGUMENTS"
description: "Event-driven workflow trigger management"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d211a1526828aa777430437ce287cdffc4307d328bf0a8a26b5023593f3d4d3a"
---

# /workflow-trigger

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong workflow-trigger $ARGUMENTS
```

## Source Command

# /workflow:trigger — Event Triggers
**IC super command** — Event-driven workflow trigger management
## Pipeline
```
SEQUENTIAL: define-events → create-triggers → test
```
## Trigger
Runs recipe `recipes/workflow/trigger.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/workflow:trigger [goal]
```
## Estimated: 2 credits, 8 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
