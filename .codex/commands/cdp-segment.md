---
codex-command: "/cdp-segment"
source: ".claude/commands/cdp-segment.md"
invocation: "mekong cdp-segment $ARGUMENTS"
description: "Dynamic customer segmentation by behavior and value"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "08a72f870fdeec270cc7038411b81802ddbf03de3c26e0f96087ec9176a5d318"
---

# /cdp-segment

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cdp-segment $ARGUMENTS
```

## Source Command

# /cdp:segment — Customer Segmentation
**IC super command** — Dynamic customer segmentation by behavior and value
## Pipeline
```
SEQUENTIAL: define-criteria → compute-segments → activate
```
## Trigger
Runs recipe `recipes/cdp/segment.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/cdp:segment [goal]
```
## Estimated: 2 credits, 8 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
