---
codex-command: "/pm-release-note"
source: ".claude/commands/pm-release-note.md"
invocation: "mekong pm-release-note $ARGUMENTS"
description: "Changelog generation and stakeholder communication"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "98434877565874fb52b07e0dee412a146c58766a7ba3f347bd1b3ed5bb27320d"
---

# /pm-release-note

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-release-note $ARGUMENTS
```

## Source Command

# /pm:release-note — Release Notes

**IC super command** — Changelog generation and stakeholder communication

## Pipeline

```
SEQUENTIAL: generate-changelog → format-notes → distribute
```

## Trigger

Runs recipe `recipes/pm/release-note.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/pm:release-note [goal]
```

## Estimated: 2 credits, 5 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
