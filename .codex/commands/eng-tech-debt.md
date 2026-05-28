---
codex-command: "/eng-tech-debt"
source: ".claude/commands/eng-tech-debt.md"
invocation: "mekong eng-tech-debt $ARGUMENTS"
description: "Audit → prioritize → refactor → test → verify tech debt"
argument-hint: "[focus area or module]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "43e3ee2017ea70987bb49aa590238a6eee4a66cebcf6cb1990a863920a9eeba4"
---

# /eng-tech-debt

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong eng-tech-debt $ARGUMENTS
```

## Source Command

# /eng:tech-debt — Tech Debt Sprint

**Super command** — chains 5 commands via DAG pipeline.

## Pipeline

```
[audit] ══╗
[coverage] ╣ (parallel)
[lint]  ══╝
           ▼
      [refactor $ARGUMENTS]
           │
           ▼
       [test --all]
```

## Estimated: 20 credits, 40 minutes

## Execution

Load recipe: `recipes/eng/tech-debt.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
