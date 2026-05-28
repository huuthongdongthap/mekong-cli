---
codex-command: "/tech-migration"
source: ".claude/commands/tech-migration.md"
invocation: "mekong tech-migration $ARGUMENTS"
description: "Audit current → plan migration → generate scripts → test → verify"
argument-hint: "[migration target or version]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "2a4e718bcebfa9f9423c4356a3c6fbf641fc61bf582e6ffca87fbf89a1a66750"
---

# /tech-migration

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong tech-migration $ARGUMENTS
```

## Source Command

# /tech:migration — Migration Pipeline

**Super command** — chains 4 commands via DAG pipeline.

## Pipeline

```
[schema --current] ══╗
[audit --data]     ══╝ (parallel)
                      ▼
        [migrate --output migration-scripts.md]
                      │
                      ▼
             [test --migration]
```

## Estimated: 18 credits, 30 minutes

## Execution

Load recipe: `recipes/tech/migration.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
