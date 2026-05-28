---
codex-command: "/incident-postmortem"
source: ".claude/commands/incident-postmortem.md"
invocation: "mekong incident-postmortem $ARGUMENTS"
description: "Structured blameless postmortem generation"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "890f4cf99f55d1eee0e17e2a39c10b28ef7fa7b84961df3a184197fe3f4ade0d"
---

# /incident-postmortem

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong incident-postmortem $ARGUMENTS
```

## Source Command

# /incident:postmortem — Postmortem Generator
**IC super command** — Structured blameless postmortem generation
## Pipeline
```
SEQUENTIAL: collect-timeline → analyze-cause → generate-doc
```
## Trigger
Runs recipe `recipes/incident/postmortem.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/incident:postmortem [goal]
```
## Estimated: 3 credits, 10 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
