---
codex-command: "/devops-rollback"
source: ".claude/commands/devops-rollback.md"
invocation: "mekong devops-rollback $ARGUMENTS"
description: "Emergency rollback → smoke test → health check → incident report"
argument-hint: "[version or commit to roll back to]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "78087448fb95465e3607f46d1e219c6086ae1b2e15578c8c2e29b2e9c6137b99"
---

# /devops-rollback

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong devops-rollback $ARGUMENTS
```

## Source Command

# /devops:rollback — Emergency Rollback

**Super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
[rollback $ARGUMENTS]
          │
          ▼
  [smoke] ══╗
  [health] ══╝ (parallel)
```

## Estimated: 5 credits, 10 minutes

## Execution

Load recipe: `recipes/devops/rollback.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
