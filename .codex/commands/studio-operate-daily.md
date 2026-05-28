---
codex-command: "/studio-operate-daily"
source: ".claude/commands/studio-operate-daily.md"
invocation: "mekong studio-operate-daily $ARGUMENTS"
description: "Daily studio ops — standup, tickets, invoices, metrics across all portfolio companies. 4 commands, ~10 min."
argument-hint: "[optional: company-slug to focus on]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d3aec2ad97e92adeae9476ded78bb146fe551b89d9561879730049431ba4d4c0"
---

# /studio-operate-daily

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong studio-operate-daily $ARGUMENTS
```

## Source Command

# /studio:operate:daily — Daily Studio Operations

**IC super command** — chains 4 commands via DAG pipeline.

## Pipeline

```
[morning] ────────────────────────────────── PARALLEL
  ├── studio status                 → Andon dashboard
  ├── portfolio health --all        → health alerts
  └── dealflow list --action-due    → follow-up reminders

[execute] ────────────────────────────────── SEQUENTIAL (after morning)
  └── portfolio report --daily      → daily digest
```

## Estimated: 3 credits, 10 minutes

## Execution

Load recipe: `recipes/studio/operate-daily.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>

## Engine Note

CRITICAL: Each sub-command MUST run via `mekong` CLI engine, NOT manual file operations.
Example: "portfolio-create" → `mekong portfolio create $ARGS`
