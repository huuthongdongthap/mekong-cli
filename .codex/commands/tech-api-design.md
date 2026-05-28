---
codex-command: "/tech-api-design"
source: ".claude/commands/tech-api-design.md"
invocation: "mekong tech-api-design $ARGUMENTS"
description: "Requirements → schema → OpenAPI spec → implementation plan"
argument-hint: "[API or feature to design]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "dbe9eaa8977a5a2ff0ac3b49d512bec8c4c83410f6c3c4abf50844bf074ed723"
---

# /tech-api-design

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong tech-api-design $ARGUMENTS
```

## Source Command

# /tech:api-design — API Design

**Super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
[schema --output data-model.md]
               │
               ▼
   [api --design --output api-spec.md]
               │
               ▼
   [plan --output implementation-plan.md]
```

## Estimated: 12 credits, 20 minutes

## Execution

Load recipe: `recipes/tech/api-design.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
