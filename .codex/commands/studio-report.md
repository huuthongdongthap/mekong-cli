---
codex-command: "/studio-report"
source: ".claude/commands/studio-report.md"
invocation: "mekong studio-report $ARGUMENTS"
description: "Generate investor report (weekly/monthly). 5 credits, ~20 min."
argument-hint: "[context or goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "4bfbe2c59d9f209bd0d3709bd2b353e3a1c0ca729467a3aea7e0d87c3a2710af"
---

# /studio-report

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong studio-report $ARGUMENTS
```

## Source Command

# /studio:report — Investor Report

**VC Studio super command** — portfolio-level orchestration.

## Pipeline

```
DELEGATION: studio:report → cto:* → dev:* → worker:*
OUTPUT: reports/studio/report/
```

## Estimated: 5 credits, ~20 minutes

## Execution

Load recipe: `recipes/studio/report.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
