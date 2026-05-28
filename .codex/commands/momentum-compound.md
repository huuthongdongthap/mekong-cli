---
codex-command: "/momentum-compound"
source: ".claude/commands/momentum-compound.md"
invocation: "mekong momentum-compound $ARGUMENTS"
description: "Compound growth calculator — retention curves, expansion revenue"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "24fc31add1e9da69f2ff4fa8d28a2927d5a2d638208afcae9896e0a33ce238b4"
---

# /momentum-compound

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong momentum-compound $ARGUMENTS
```

## Source Command

# /momentum:compound — Compound Growth

**IC super command** — Compound growth calculator — retention curves, expansion revenue

## Pipeline

```
PARALLEL: retention-curve + expansion-analysis\nSEQUENTIAL: compound-model
```

## Trigger

Runs recipe `recipes/momentum/compound.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/momentum:compound [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
