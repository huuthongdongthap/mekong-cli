---
codex-command: "/sec-soc"
source: ".claude/commands/sec-soc.md"
invocation: "mekong sec-soc $ARGUMENTS"
description: "Security operations center dashboard"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "63b28dc3acb1b4cf79188cbee1863dc89bfdec580aa129a174e662f2315bcf2e"
---

# /sec-soc

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sec-soc $ARGUMENTS
```

## Source Command

# /sec:soc — SOC Dashboard

**IC super command** — Security operations center dashboard

## Pipeline

```
SEQUENTIAL: siem-ingest → correlate-alerts → threat-detect
    |
OUTPUT: reports/sec/soc/
```

## Trigger

Runs recipe `recipes/sec/soc.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/sec:soc [goal]
```

## Estimated: 2 credits, 5 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
