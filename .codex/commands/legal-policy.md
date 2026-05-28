---
codex-command: "/legal-policy"
source: ".claude/commands/legal-policy.md"
invocation: "mekong legal-policy $ARGUMENTS"
description: "Legal policy creation — terms of service, privacy policy, acceptable use. 3 steps, ~25 min."
argument-hint: "[policy type: ToS / privacy / AUP]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "8b59b6d27109a4d38863a5484a88734d7139527cb527748780fd0307eaac357e"
---

# /legal-policy

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong legal-policy $ARGUMENTS
```

## Source Command

# /legal:legal-policy — Legal Policy Draft

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── requirements-gather     → requirements.md
  ├── policy-draft            → policy-draft.md
  └── legal-review            → final-policy.md
```

## Output directory: reports/legal/legal-policy/
