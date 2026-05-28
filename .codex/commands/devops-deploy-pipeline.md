---
codex-command: "/devops-deploy-pipeline"
source: ".claude/commands/devops-deploy-pipeline.md"
invocation: "mekong devops-deploy-pipeline $ARGUMENTS"
description: "Lint → test → build → staging → smoke → production deployment pipeline"
argument-hint: "[service or tag to deploy]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d9c41ff452e1ae511909ad72b3629fe8a84b784399b8c8c581568429d3e87276"
---

# /devops-deploy-pipeline

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong devops-deploy-pipeline $ARGUMENTS
```

## Source Command

# /devops:deploy-pipeline — Deployment Pipeline

**Super command** — chains 6 commands via DAG pipeline.

## Pipeline

```
[lint] ══╗
[typecheck] ╣ (parallel)
[test --all] ╝
              ▼
     [deploy-staging]
              │
              ▼
          [smoke]
              │
              ▼
       [deploy-prod]
```

## Estimated: 18 credits, 30 minutes

## Execution

Load recipe: `recipes/devops/deploy-pipeline.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
