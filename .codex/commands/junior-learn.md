---
codex-command: "/junior-learn"
source: ".claude/commands/junior-learn.md"
invocation: "mekong junior-learn $ARGUMENTS"
description: "Junior learn — architecture overview, module deep dive, key patterns in 10 min"
argument-hint: "[module or topic to learn]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "f5ab8713254d13652f7cb57fe926cf345505d5c15c2b301ea16773018ff1d1ad"
---

# /junior-learn

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong junior-learn $ARGUMENTS
```

## Source Command

# /junior:learn — Learn Codebase

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
SEQUENTIAL: /arch --explain → /docs                             (~10 min)
    |
OUTPUT: reports/junior/learn/
```

## Estimated: 3 credits, 10 minutes

## Execution

Load recipe: `recipes/junior/junior-learn.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
