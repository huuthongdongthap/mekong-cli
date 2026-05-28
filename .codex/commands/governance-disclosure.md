---
codex-command: "/governance-disclosure"
source: ".claude/commands/governance-disclosure.md"
invocation: "mekong governance-disclosure $ARGUMENTS"
description: "SEC disclosure requirements tracking"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "7f5bd710500d093e81ccd0855f3a6385de964c13b8c008b5724006cbf8c8bd5e"
---

# /governance-disclosure

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong governance-disclosure $ARGUMENTS
```

## Source Command

# /governance:disclosure — SEC Disclosure

**IC super command** — SEC disclosure requirements tracking

## Pipeline

```
SEQUENTIAL: identify-requirements → track-deadlines → prepare-filings
OUTPUT: reports/governance/disclosure/
```

## Trigger

Runs recipe `recipes/governance/disclosure.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/governance:disclosure [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
