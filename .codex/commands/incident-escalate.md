---
codex-command: "/incident-escalate"
source: ".claude/commands/incident-escalate.md"
invocation: "mekong incident-escalate $ARGUMENTS"
description: "Automated escalation policy execution"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "f860c5414b28498b4f3795d449e9c5d37a3b7c91f1bfbd03c5a9a6aa3f987cbc"
---

# /incident-escalate

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong incident-escalate $ARGUMENTS
```

## Source Command

# /incident:escalate — Escalation Engine
**IC super command** — Automated escalation policy execution
## Pipeline
```
SEQUENTIAL: detect-sla-breach → escalate → notify
```
## Trigger
Runs recipe `recipes/incident/escalate.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/incident:escalate [goal]
```
## Estimated: 2 credits, 5 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
