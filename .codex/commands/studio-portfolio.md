---
codex-command: "/studio-portfolio"
source: ".claude/commands/studio-portfolio.md"
invocation: "mekong studio-portfolio $ARGUMENTS"
description: "Portfolio dashboard — P&L, MRR, runway. 5 credits, ~15 min."
argument-hint: "[context or goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "df7e83b643c3acb35bfac0c0202213152e08bd07a9efc08c0dbe2934bec22618"
---

# /studio-portfolio

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong studio-portfolio $ARGUMENTS
```

## Source Command

# /studio:portfolio — Portfolio Dashboard

**VC Studio super command** — portfolio-level orchestration.

## Pipeline

```
DELEGATION: studio:portfolio → cto:* → dev:* → worker:*
OUTPUT: reports/studio/portfolio/
```

## Estimated: 5 credits, ~15 minutes

## Execution

Load recipe: `recipes/studio/portfolio.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
