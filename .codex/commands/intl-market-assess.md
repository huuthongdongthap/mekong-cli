---
codex-command: "/intl-market-assess"
source: ".claude/commands/intl-market-assess.md"
invocation: "mekong intl-market-assess $ARGUMENTS"
description: "Market entry analysis per country"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "bfbd71928588d5e0b9172b803b5acbca4a86c37b918e9b58fbd27a5194f27868"
---

# /intl-market-assess

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong intl-market-assess $ARGUMENTS
```

## Source Command

# /intl:market-assess — Market Assessment

**IC super command** — Market entry analysis per country

## Pipeline

```
SEQUENTIAL: macro-analysis → regulatory-scan → competitive-landscape → go-nogo
```

## Trigger

Runs recipe `recipes/intl/market-assess.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/intl:market-assess [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
