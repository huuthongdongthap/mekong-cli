---
codex-command: "/eng-sprint-execute"
source: ".claude/commands/eng-sprint-execute.md"
invocation: "mekong eng-sprint-execute $ARGUMENTS"
description: "Plan parallel → implement features → test all → review → ship"
argument-hint: "[sprint goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "468a5d4aeb19682157f1134f8009ba10e768f52449bcff722b63dbad941f3ae2"
---

# /eng-sprint-execute

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong eng-sprint-execute $ARGUMENTS
```

## Source Command

# /eng:sprint-execute — Sprint Execution

**Super command** — chains 5 commands via DAG pipeline.

## Pipeline

```
[plan]
  └─► [cook --phase-1] ══╗
      [cook --phase-2] ══╣ (parallel)
                         ▼
                [test --all] ══╗
                [review]    ══╣ (parallel)
                               ▼
                        [deploy-staging]
```

## Estimated: 25 credits, 50 minutes

## Execution

Load recipe: `recipes/eng/sprint-execute.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
