---
codex-command: "/incident-status"
source: ".claude/commands/incident-status.md"
invocation: "mekong incident-status $ARGUMENTS"
description: "Public and internal status page management"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "c27fc77639527cb50f2cf34eff0dddc8cbf64999701c2965aaab72b5fca1f00c"
---

# /incident-status

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong incident-status $ARGUMENTS
```

## Source Command

# /incident:status — Status Page
**IC super command** — Public and internal status page management
## Pipeline
```
SEQUENTIAL: check-services → update-status → notify-subscribers
```
## Trigger
Runs recipe `recipes/incident/status.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/incident:status [goal]
```
## Estimated: 2 credits, 5 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
