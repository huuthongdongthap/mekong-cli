---
codex-command: "/ui-design-review"
source: ".claude/commands/ui-design-review.md"
invocation: "mekong ui-design-review $ARGUMENTS"
description: "Audit components, check consistency, flag issues. 2 commands, ~8 min."
argument-hint: "[component, page, or design system to review]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "b85c4749c1eca65d8991b5f24604641b530ad39f443ae2625fcbbca7a76c52ee"
---

# /ui-design-review

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ui-design-review $ARGUMENTS
```

## Source Command

# /ui:design-review — Design Review

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
[process] ─────────────────────────────────────── SEQUENTIAL
  ├── review --design          → design-audit.md
  └── lint --css               → css-issues.md
```

## Estimated: 3 credits, 8 minutes

## Execution

Load recipe: `recipes/ui/design-review.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
