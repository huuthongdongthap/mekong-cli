---
codex-command: "/marketing-campaign-run"
source: ".claude/commands/marketing-campaign-run.md"
invocation: "mekong marketing-campaign-run $ARGUMENTS"
description: "Audience targeting, ad creatives, channel strategy, campaign launch checklist. 4 commands, ~25 min."
argument-hint: "[campaign goal or product]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "b0f04913715dba3d78c023b73c15e315e9edd91d98cd1ffa21afbaa694233378"
---

# /marketing-campaign-run

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong marketing-campaign-run $ARGUMENTS
```

## Source Command

# /marketing:campaign-run — Campaign Execution

**Super command** — chains 4 commands via DAG pipeline.

## Pipeline

```
PARALLEL: /marketing-plan + /customer-research (~10 min)
    |
PARALLEL: /ads + /campaign                     (~15 min)
    |
OUTPUT: reports/marketing/campaign/
```

## Estimated: 15 credits, 25 minutes

## Execution

Load recipe: `recipes/marketing/campaign-run.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
