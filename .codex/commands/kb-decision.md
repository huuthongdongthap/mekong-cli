---
codex-command: "/kb-decision"
source: ".claude/commands/kb-decision.md"
invocation: "mekong kb-decision $ARGUMENTS"
description: "Log and track important business and technical decisions"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "98688c796ef5c370f6fbea46ebcb376a7bccea36e80546b9a9f50a29770a5496"
---

# /kb-decision

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong kb-decision $ARGUMENTS
```

## Source Command

# /kb:decision — Decision Log
**IC super command** — Log and track important business and technical decisions
## Pipeline
```
SEQUENTIAL: log-decision → assign-owner → set-review-date
```
## Trigger
Runs recipe `recipes/kb/decision.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/kb:decision [goal]
```
## Estimated: 2 credits, 5 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
