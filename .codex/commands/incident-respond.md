---
codex-command: "/incident-respond"
source: ".claude/commands/incident-respond.md"
invocation: "mekong incident-respond $ARGUMENTS"
description: "Incident response — triage, investigation, mitigation, post-mortem template. 4 steps, ~20 min."
argument-hint: "[incident description or alert]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "560f25d561fa485684e1e36cc4bf26830fc12b808d4abfc9bc334d8bfebac2a2"
---

# /incident-respond

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong incident-respond $ARGUMENTS
```

## Source Command

# /ops:incident-respond — Incident Response

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── triage                  → severity-assessment.md
  ├── investigation           → root-cause.md
  ├── mitigation              → action-plan.md
  └── post-mortem             → post-mortem.md
```

## Output directory: reports/ops/incident-respond/
