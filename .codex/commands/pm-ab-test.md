---
codex-command: "/pm-ab-test"
source: ".claude/commands/pm-ab-test.md"
invocation: "mekong pm-ab-test $ARGUMENTS"
description: "Experiment design, statistical analysis, auto-rollback"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "20bb4ca387787a6193ad48cd5c2e2da79d91de775b4ecf1ec7fafab081fb8b51"
---

# /pm-ab-test

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-ab-test $ARGUMENTS
```

## Source Command

# /pm:ab-test — A/B Testing

**IC super command** — Experiment design, statistical analysis, auto-rollback

## Pipeline

```
SEQUENTIAL: design-experiment → launch → analyze-stats → decide-rollback
```

## Trigger

Runs recipe `recipes/pm/ab-test.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/pm:ab-test [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
