---
codex-command: "/cdp-journey"
source: ".claude/commands/cdp-journey.md"
invocation: "mekong cdp-journey $ARGUMENTS"
description: "Customer journey mapping and optimization"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "73483777f12b8da5fce09768f4d4726f66903fe4a8788add91271db9a8a026cc"
---

# /cdp-journey

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cdp-journey $ARGUMENTS
```

## Source Command

# /cdp:journey — Journey Mapping
**IC super command** — Customer journey mapping and optimization
## Pipeline
```
SEQUENTIAL: track-events → build-journey → identify-dropoffs
```
## Trigger
Runs recipe `recipes/cdp/journey.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/cdp:journey [goal]
```
## Estimated: 2 credits, 8 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
