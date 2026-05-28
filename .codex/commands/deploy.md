---
codex-command: "/deploy"
source: ".claude/commands/deploy.md"
invocation: "mekong deploy $ARGUMENTS"
description: "Deployment execution — pre-flight checks, deploy, smoke test, rollback plan. 4 steps, ~15 min."
argument-hint: "[environment: staging / production]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "34a836f119025bbfdc450441f4ee2e8b591e405acbdb9d34bc4e383991fe532b"
---

# /deploy

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong deploy $ARGUMENTS
```

## Source Command

# /devops:deploy — Deploy

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── pre-flight              → checklist.md
  ├── deploy-execute          → deploy-log.md
  ├── smoke-test              → test-results.md
  └── rollback-plan           → rollback.md
```

## Output directory: reports/devops/deploy/
