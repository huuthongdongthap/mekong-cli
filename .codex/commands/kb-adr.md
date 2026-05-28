---
codex-command: "/kb-adr"
source: ".claude/commands/kb-adr.md"
invocation: "mekong kb-adr $ARGUMENTS"
description: "Create and manage ADRs for key technical decisions"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d0ca31c8df06de160ec7301656419a03cdb88f3ce3ad430b622d2ac91fc2ed92"
---

# /kb-adr

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong kb-adr $ARGUMENTS
```

## Source Command

# /kb:adr — Architecture Decision Records
**IC super command** — Create and manage ADRs for key technical decisions
## Pipeline
```
SEQUENTIAL: create-adr → link-context → publish
```
## Trigger
Runs recipe `recipes/kb/adr.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/kb:adr [goal]
```
## Estimated: 2 credits, 5 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
