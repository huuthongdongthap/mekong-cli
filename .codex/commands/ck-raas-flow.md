---
codex-command: "/ck-raas-flow"
source: ".claude/commands/ck-raas-flow.md"
invocation: "mekong ck-raas-flow $ARGUMENTS"
description: "RAAS Pipeline Status Dashboard — view progress across all projects in plans/"
argument-hint: "[status|metrics|next|kill <project>]"
allowed-tools: "default"
content-sha256: "0b9158ce7ebe27afff33a508feee8f6c4a4bcb49fc359f5c56c9b73321a0ade2"
---

# /ck-raas-flow

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ck-raas-flow $ARGUMENTS
```

## Source Command

# /ck-raas-flow — RAAS Pipeline Status Dashboard

Show current RAAS pipeline status across all projects.

## Overview

Read all plan directories in ./plans/ and report progress table.

## Commands

- `/ck-raas-flow` or `/ck-raas-flow status` — Show pipeline table (default)
- `/ck-raas-flow metrics` — Token usage per project from quota-tracking
- `/ck-raas-flow next` — Show next actionable task across all projects
- `/ck-raas-flow kill {project}` — Archive a failed project to ./plans/archive/

## Action

```
RAAS Pipeline Status
====================
| Project | Phase | Status | Revenue Target | ETA |
|---------|-------|--------|---------------|-----|
```

For each project with a plan.md:
1. Read plan.md, extract project name and phases
2. Check phase-*.md files for completion status (look for [x] checkboxes)
3. Calculate overall progress percentage
4. Show blocked items

## Token Budget

- Status output: max 500 tokens
- No explanations, just data

## Related Commands

- `/raas-create` — Create new RAAS project scaffold
- `/raas-scaffold` — Scaffold project from template
- `/raas/` — Sub-commands directory

---

*Ported from claudekit ~/.claude/commands/raas-flow.md — 2026-04-16*
