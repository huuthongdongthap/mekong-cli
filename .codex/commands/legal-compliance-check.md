---
codex-command: "/legal-compliance-check"
source: ".claude/commands/legal-compliance-check.md"
invocation: "mekong legal-compliance-check $ARGUMENTS"
description: "Compliance check — privacy policy → terms → data handling → regulatory gaps"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "59c5941dfb69993293962936d971e71460cdc0b56562c38f4c51c312f0cd5ced"
---

# /legal-compliance-check

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong legal-compliance-check $ARGUMENTS
```

## Source Command

# /legal:compliance-check — Compliance Check

**Super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
[audit] ────────────────────────────────────────── PARALLEL
  ├── security --compliance     → data-handling.md
  └── audit --legal             → regulatory-gaps.md
         │
         ▼
[fix] ──────────────────────────────────────────── SEQUENTIAL
  └── agreement --templates     → policy-updates.md
```

## Estimated: 10 credits, 15 minutes

## Execution

Load recipe: `recipes/legal/compliance-check.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
