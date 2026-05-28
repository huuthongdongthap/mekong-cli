---
codex-command: "/cto-archive"
source: ".claude/commands/cto-archive.md"
invocation: "mekong cto-archive $ARGUMENTS"
description: "Archive project. 3 credits, ~10 min."
argument-hint: "[project or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "f33c4ac7eae331a261a26f022e112b63e7c9b4a27bd7014a36d94fda8d80cc18"
---

# /cto-archive

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cto-archive $ARGUMENTS
```

## Source Command

# /cto:archive — Project Archive

**CTO strategic command** — architecture and team orchestration.

## Pipeline

```
DELEGATION: cto:archive → pm:* / dev:* → worker:*
OUTPUT: reports/cto/archive/
```

## Estimated: 3 credits, ~10 minutes

## Execution

Load recipe: `recipes/cto/archive.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
