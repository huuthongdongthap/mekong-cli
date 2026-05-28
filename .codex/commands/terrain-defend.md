---
codex-command: "/terrain-defend"
source: ".claude/commands/terrain-defend.md"
invocation: "mekong terrain-defend $ARGUMENTS"
description: "Maintain and strengthen defensive market position"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "aba807ac91e858104dfd6560caf40a93afbee68d7998342e9398bf4a1993e5c8"
---

# /terrain-defend

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong terrain-defend $ARGUMENTS
```

## Source Command

# /terrain:defend — Defensive Position

**IC super command** — Maintain and strengthen defensive market position

## Pipeline

```
SEQUENTIAL: audit-moat → identify-threats → reinforce-defenses
```

## Trigger

Runs recipe `recipes/terrain/defend.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/terrain:defend [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
