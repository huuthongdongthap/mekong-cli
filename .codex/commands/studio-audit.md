---
codex-command: "/studio-audit"
source: ".claude/commands/studio-audit.md"
invocation: "mekong studio-audit $ARGUMENTS"
description: "Full portfolio ROI audit across all projects. Delegates cto:review per project. 10 credits, ~60 min."
argument-hint: "[context or goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "8b94aa05b4ee4fbef9742705ac8c48a5527c117d512ea91c9ca242a5affd5218"
---

# /studio-audit

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong studio-audit $ARGUMENTS
```

## Source Command

# /studio:audit — Portfolio Audit

**VC Studio super command** — portfolio-level orchestration.

## Pipeline

```
DELEGATION: studio:audit → cto:* → dev:* → worker:*
OUTPUT: reports/studio/audit/
```

## Estimated: 10 credits, ~60 minutes

## Execution

Load recipe: `recipes/studio/audit.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
