---
codex-command: "/sre-incident"
source: ".claude/commands/sre-incident.md"
invocation: "mekong sre-incident $ARGUMENTS"
description: "SRE incident — triage, mitigate, verify, report in 10 min"
argument-hint: "[incident description or affected service]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "15a477532979d350fa51074a571514e5873dd70e7c7837703098979cade619e1"
---

# /sre-incident

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sre-incident $ARGUMENTS
```

## Source Command

# /sre:incident — Incident Response

**IC super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
SEQUENTIAL: /debug → /fix --hotfix → /smoke                     (~10 min)
    |
OUTPUT: reports/sre/incident/
```

## Estimated: 5 credits, 10 minutes

## Execution

Load recipe: `recipes/sre/sre-incident.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
