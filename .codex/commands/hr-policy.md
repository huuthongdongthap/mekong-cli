---
codex-command: "/hr-policy"
source: ".claude/commands/hr-policy.md"
invocation: "mekong hr-policy $ARGUMENTS"
description: "HR policy drafting — policy structure, compliance check, approval workflow. 3 steps, ~20 min."
argument-hint: "[policy type: PTO / remote / code-of-conduct]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "63960abf16aef850d0bebc2bf16842894d280ec5c104f2ed33c45d13ee1afe97"
---

# /hr-policy

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong hr-policy $ARGUMENTS
```

## Source Command

# /hr:hr-policy — HR Policy Draft

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── policy-research         → benchmarks.md
  ├── policy-draft            → policy.md
  └── compliance-review       → review-notes.md
```

## Output directory: reports/hr/hr-policy/
