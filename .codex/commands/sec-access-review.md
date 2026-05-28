---
codex-command: "/sec-access-review"
source: ".claude/commands/sec-access-review.md"
invocation: "mekong sec-access-review $ARGUMENTS"
description: "SOX quarterly access recertification"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "43731a419642be743f770c26434400877cf9c294278ea10b96be8f871fa994ae"
---

# /sec-access-review

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sec-access-review $ARGUMENTS
```

## Source Command

# /sec:access-review — Access Review

**IC super command** — SOX quarterly access recertification

## Pipeline

```
SEQUENTIAL: extract-access → send-review → collect-attestation → remediate
    |
OUTPUT: reports/sec/access-review/
```

## Trigger

Runs recipe `recipes/sec/access-review.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/sec:access-review [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
