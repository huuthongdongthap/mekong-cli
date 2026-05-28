---
codex-command: "/design-user-research"
source: ".claude/commands/design-user-research.md"
invocation: "mekong design-user-research $ARGUMENTS"
description: "UX research sprint — personas → user journeys → pain points → opportunity map"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "51a864c825d6247489f5758bde0004b1e6cefa8ece12ee4b3f345864ae597728"
---

# /design-user-research

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong design-user-research $ARGUMENTS
```

## Source Command

# /design:user-research — UX Research Sprint

**Super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
[discover] ─────────────────────────────────────── PARALLEL
  ├── persona                   → personas.md
  └── feedback                  → user-feedback.md
         │
         ▼
[synthesize] ───────────────────────────────────── SEQUENTIAL
  └── brainstorm                → opportunity-map.md
```

## Estimated: 12 credits, 20 minutes

## Execution

Load recipe: `recipes/design/user-research.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
