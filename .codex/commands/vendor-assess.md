---
codex-command: "/vendor-assess"
source: ".claude/commands/vendor-assess.md"
invocation: "mekong vendor-assess $ARGUMENTS"
description: "Risk tiering and SOC 2 verification"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "14d6894f364532ddc713efcba6edab345adccb250bb4fb5d3fbb43d974acfb1f"
---

# /vendor-assess

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong vendor-assess $ARGUMENTS
```

## Source Command

# /vendor:assess — Vendor Assessment

**IC super command** — Risk tiering and SOC 2 verification

## Pipeline

```
SEQUENTIAL: collect-questionnaire → risk-tier → verify-soc2
```

## Trigger

Runs recipe `recipes/vendor/assess.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/vendor:assess [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
