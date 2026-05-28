---
codex-command: "/obs-logs"
source: ".claude/commands/obs-logs.md"
invocation: "mekong obs-logs $ARGUMENTS"
description: "Centralized log aggregation and search"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "288ef8d770e0719d47eab3aed30d6a51e504fa1978f9f692047202746226c01b"
---

# /obs-logs

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong obs-logs $ARGUMENTS
```

## Source Command

# /obs:logs — Log Aggregation
**IC super command** — Centralized log aggregation and search
## Pipeline
```
SEQUENTIAL: configure-shipping → aggregate → index
```
## Trigger
Runs recipe `recipes/obs/logs.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/obs:logs [goal]
```
## Estimated: 2 credits, 8 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
