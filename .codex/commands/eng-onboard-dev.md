---
codex-command: "/eng-onboard-dev"
source: ".claude/commands/eng-onboard-dev.md"
invocation: "mekong eng-onboard-dev $ARGUMENTS"
description: "Codebase tour → setup guide → first ticket → contribution guide for new developer"
argument-hint: "[new developer name or role]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "fb43d356c69191f17639d260548e7b5b44f93464a968abe21141ce9a3dd9a3e9"
---

# /eng-onboard-dev

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong eng-onboard-dev $ARGUMENTS
```

## Source Command

# /eng:onboard-dev — Developer Onboarding

**Super command** — chains 4 commands via DAG pipeline.

## Pipeline

```
[docs-onboard] ══╗
[arch --overview] ╝ (parallel)
                  ▼
    [kanban --first-ticket]
               │
               ▼
        [docs-readme]
```

## Estimated: 10 credits, 15 minutes

## Execution

Load recipe: `recipes/eng/onboard-dev.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
