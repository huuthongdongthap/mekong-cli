---
codex-command: "/hr-performance-cycle"
source: ".claude/commands/hr-performance-cycle.md"
invocation: "mekong hr-performance-cycle $ARGUMENTS"
description: "Performance review cycle — self-assessment → manager review → calibration → feedback delivery"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "82d94988bb5f9df7e0ce96a5814315e84963249565b058073e9ff00523f4f9ee"
---

# /hr-performance-cycle

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong hr-performance-cycle $ARGUMENTS
```

## Source Command

# /hr:performance-cycle — Performance Review Cycle

**Super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
[assess] ──────────────────────────────────────── PARALLEL
  ├── performance-review        → review-templates.md
  └── kpi --team                → team-metrics.md
         │
         ▼
[deliver] ─────────────────────────────────────── SEQUENTIAL
  └── feedback                  → feedback-guides.md
```

## Estimated: 10 credits, 15 minutes

## Execution

Load recipe: `recipes/hr/performance-cycle.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
