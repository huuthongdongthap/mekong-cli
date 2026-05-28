---
codex-command: "/pm-standup"
source: ".claude/commands/pm-standup.md"
invocation: "mekong pm-standup $ARGUMENTS"
description: "Daily standup report. 1 credit, ~5 min."
argument-hint: "[task or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "435af71da269bfd13a5f6f0c43489a043b251eb731e3c4811bb180e7a5b9b336"
---

# /pm-standup

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong pm-standup $ARGUMENTS
```

## Source Command

# /pm:standup — Daily Standup

**PM tactical command** — sprint and task management.

## Pipeline

```
DELEGATION: pm:standup → dev:* → worker:*
OUTPUT: reports/pm/standup/
```

## Estimated: 1 credits, ~5 minutes

## Execution

Load recipe: `recipes/pm/standup.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
