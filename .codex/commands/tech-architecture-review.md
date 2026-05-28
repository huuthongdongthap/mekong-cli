---
codex-command: "/tech-architecture-review"
source: ".claude/commands/tech-architecture-review.md"
invocation: "mekong tech-architecture-review $ARGUMENTS"
description: "API audit → schema review → dependency analysis → improvement plan"
argument-hint: "[system or component to review]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "ce1ff39dba455e6ab3da41dfc0bd50b2ab0dcff6dd978c3db53c5d5d424b5408"
---

# /tech-architecture-review

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong tech-architecture-review $ARGUMENTS
```

## Source Command

# /tech:architecture-review — Architecture Review

**Super command** — chains 4 commands via DAG pipeline.

## Pipeline

```
[arch --audit] ══╗
[api --audit]  ══╣ (parallel)
[schema --audit] ╝
                 ▼
          [plan --output improvement-plan.md]
```

## Estimated: 15 credits, 25 minutes

## Execution

Load recipe: `recipes/tech/architecture-review.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
