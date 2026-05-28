---
codex-command: "/dev-feature"
source: ".claude/commands/dev-feature.md"
invocation: "mekong dev-feature $ARGUMENTS"
description: "Feature build — plan, code, test, PR. Full feature cycle in 15 min"
argument-hint: "[feature description]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "39cee12dd49b3ad0116cbfb956e14941c42c46025a10529bb8d982088954303c"
---

# /dev-feature

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong dev-feature $ARGUMENTS
```

## Source Command

# /dev:feature — Feature Build

**IC super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
SEQUENTIAL: /cook → /test --all → /pr                           (~15 min)
    |
OUTPUT: reports/dev/feature/
```

## Estimated: 8 credits, 15 minutes

## Execution

Load recipe: `recipes/dev/dev-feature.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
