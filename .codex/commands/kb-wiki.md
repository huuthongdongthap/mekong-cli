---
codex-command: "/kb-wiki"
source: ".claude/commands/kb-wiki.md"
invocation: "mekong kb-wiki $ARGUMENTS"
description: "Internal wiki creation, organization, and search"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "fb9c6e756cd3ce4a753b58c6d106f15c104709528dd471e2f0c7a5b9fe1c52f8"
---

# /kb-wiki

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong kb-wiki $ARGUMENTS
```

## Source Command

# /kb:wiki — Wiki Management
**IC super command** — Internal wiki creation, organization, and search
## Pipeline
```
SEQUENTIAL: create-page → categorize → index
```
## Trigger
Runs recipe `recipes/kb/wiki.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/kb:wiki [goal]
```
## Estimated: 2 credits, 5 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
