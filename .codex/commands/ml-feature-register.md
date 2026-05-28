---
codex-command: "/ml-feature-register"
source: ".claude/commands/ml-feature-register.md"
invocation: "mekong ml-feature-register $ARGUMENTS"
description: "Register ML features with metadata and lineage"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "670d1718f4350fe679d21942ea2d69c74be21c0e3c93323270b8ffe1ef08b30f"
---

# /ml-feature-register

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ml-feature-register $ARGUMENTS
```

## Source Command

# /ml:feature-register — Feature Register
**IC super command** — Register ML features with metadata and lineage
## Pipeline
```
SEQUENTIAL: define-schema → validate → publish
```
## Trigger
Runs recipe `recipes/ml/feature-register.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/ml:feature-register [goal]
```
## Estimated: 2 credits, 8 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
