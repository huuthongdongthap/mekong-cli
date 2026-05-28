---
codex-command: "/recruiter-source"
source: ".claude/commands/recruiter-source.md"
invocation: "mekong recruiter-source $ARGUMENTS"
description: "Job requirements, candidate search, outreach. 2 commands, ~10 min."
argument-hint: "[role or job description]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "b21eded07afd9a8d00ffd90cfc6f3fe3e6326739df4b33a73bdf7ba82f0c98e0"
---

# /recruiter-source

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong recruiter-source $ARGUMENTS
```

## Source Command

# /recruiter:source — Candidate Sourcing

**IC super command** — chains 2 commands via DAG pipeline.

## Pipeline

```
[process] ─────────────────────────────────────── SEQUENTIAL
  ├── leadgen --talent         → candidate-list.md
  └── email --recruit          → outreach-sent.md
```

## Estimated: 5 credits, 10 minutes

## Execution

Load recipe: `recipes/recruiter/source.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
