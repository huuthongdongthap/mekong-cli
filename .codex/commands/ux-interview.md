---
codex-command: "/ux-interview"
source: ".claude/commands/ux-interview.md"
invocation: "mekong ux-interview $ARGUMENTS"
description: "Interview script, discussion guide, insight synthesis. 2 commands, ~10 min."
argument-hint: "[user segment or research question]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "0e058573688c6bc33dc9a3883d1a3ac13d11f28ba25ccad5ea9a5ff1e9365017"
---

# /ux-interview

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ux-interview $ARGUMENTS
```

## Source Command

# /ux:interview — UX Interview

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
[process] ─────────────────────────────────────── SEQUENTIAL
  ├── persona --interview-guide → interview-script.md
  └── brainstorm               → insight-synthesis.md
```

## Estimated: 5 credits, 10 minutes

## Execution

Load recipe: `recipes/ux/interview.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
