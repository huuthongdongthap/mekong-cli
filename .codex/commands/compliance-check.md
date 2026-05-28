---
codex-command: "/compliance-check"
source: ".claude/commands/compliance-check.md"
invocation: "mekong compliance-check $ARGUMENTS"
description: "Compliance check against framework — gap identification, risk scoring, action items. 2 steps, ~15 min."
argument-hint: "[framework: GDPR / CCPA / SOX / PCI-DSS]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "fd199dbccbd3f2baf6dc9c0fcfbc6c4f16950d11322671e58322fff8e95d181e"
---

# /compliance-check

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong compliance-check $ARGUMENTS
```

## Source Command

# /compliance:compliance-check — Compliance Check

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── framework-scan          → gaps.md
  └── action-plan             → compliance-actions.md
```

## Output directory: reports/compliance/compliance-check/
