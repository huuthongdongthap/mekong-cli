---
codex-command: "/release-hotfix"
source: ".claude/commands/release-hotfix.md"
invocation: "mekong release-hotfix $ARGUMENTS"
description: "Branch → fix → test → deploy hotfix to production"
argument-hint: "[bug description or issue ID]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "1c4996924cc551db015738f19865325bec1433a0270e2ba72fe6e20b593c8d57"
---

# /release-hotfix

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong release-hotfix $ARGUMENTS
```

## Source Command

# /release:hotfix — Hotfix Pipeline

**Super command** — chains 4 commands via DAG pipeline.

## Pipeline

```
[git-branch --hotfix]
          │
          ▼
   [fix $ARGUMENTS]
          │
          ▼
    [test --all]
          │
          ▼
[deploy-prod --hotfix]
```

## Estimated: 10 credits, 15 minutes

## Execution

Load recipe: `recipes/release/hotfix.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
