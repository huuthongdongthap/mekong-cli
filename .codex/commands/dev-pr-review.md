---
codex-command: "/dev-pr-review"
source: ".claude/commands/dev-pr-review.md"
invocation: "mekong dev-pr-review $ARGUMENTS"
description: "PR review — code review and security check in parallel, 10 min"
argument-hint: "[PR number or branch name]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "12ac07085bd3764b0be4ff947a59ee7c9a57cb73fe54075f859f9869c2e11665"
---

# /dev-pr-review

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong dev-pr-review $ARGUMENTS
```

## Source Command

# /dev:pr-review — PR Review

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
PARALLEL: /review + /security --pr                              (~10 min)
    |
OUTPUT: reports/dev/pr-review/
```

## Estimated: 5 credits, 10 minutes

## Execution

Load recipe: `recipes/dev/dev-pr-review.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
