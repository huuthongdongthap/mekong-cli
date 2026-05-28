---
codex-command: "/pm-roadmap"
source: ".claude/commands/pm-roadmap.md"
invocation: "mekong pm-roadmap $ARGUMENTS"
description: "Roadmap visibility and prioritization with RICE/ICE scoring"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "94114456154c7fc06b156268b72ed411f43290cef652603b6f25c0a3baac097d"
---

# /pm-roadmap

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-roadmap $ARGUMENTS
```

## Source Command

# /pm:roadmap — Roadmap Planning

**IC super command** — Roadmap visibility and prioritization with RICE/ICE scoring

## Pipeline

```
SEQUENTIAL: gather-inputs → score-rice → prioritize → publish-roadmap
```

## Trigger

Runs recipe `recipes/pm/roadmap.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/pm:roadmap [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
