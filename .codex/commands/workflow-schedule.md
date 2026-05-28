---
codex-command: "/workflow-schedule"
source: ".claude/commands/workflow-schedule.md"
invocation: "mekong workflow-schedule $ARGUMENTS"
description: "Cron and scheduled job management"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "c7e081189aae5dfb708e69240aa645e102b4e7b01d09ca4e15c36f56a6a2b71e"
---

# /workflow-schedule

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong workflow-schedule $ARGUMENTS
```

## Source Command

# /workflow:schedule — Scheduled Jobs
**IC super command** — Cron and scheduled job management
## Pipeline
```
SEQUENTIAL: define-schedule → register-job → monitor
```
## Trigger
Runs recipe `recipes/workflow/schedule.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/workflow:schedule [goal]
```
## Estimated: 2 credits, 5 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
