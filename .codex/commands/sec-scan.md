---
codex-command: "/sec-scan"
source: ".claude/commands/sec-scan.md"
invocation: "mekong sec-scan $ARGUMENTS"
description: "SAST/DAST/SCA scanning pipeline"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "b37bc02e4c93f83ec87c243ba7a4ed0c85ff6d67008b29816531340331306bf6"
---

# /sec-scan

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sec-scan $ARGUMENTS
```

## Source Command

# /sec:scan — Security Scan

**IC super command** — SAST/DAST/SCA scanning pipeline

## Pipeline

```
PARALLEL: sast-scan + dast-scan + sca-scan
    |
SEQUENTIAL: compile-report
    |
OUTPUT: reports/sec/scan/
```

## Trigger

Runs recipe `recipes/sec/scan.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/sec:scan [goal]
```

## Estimated: 3 credits, 12 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
