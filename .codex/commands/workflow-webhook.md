---
codex-command: "/workflow-webhook"
source: ".claude/commands/workflow-webhook.md"
invocation: "mekong workflow-webhook $ARGUMENTS"
description: "Incoming and outgoing webhook management"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "f4a7e2506965621d7a3e238589379171ed5f67f4668696efa1a60a16d743bda2"
---

# /workflow-webhook

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong workflow-webhook $ARGUMENTS
```

## Source Command

# /workflow:webhook — Webhook Management
**IC super command** — Incoming and outgoing webhook management
## Pipeline
```
SEQUENTIAL: register → verify → monitor
```
## Trigger
Runs recipe `recipes/workflow/webhook.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/workflow:webhook [goal]
```
## Estimated: 2 credits, 5 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
