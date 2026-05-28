---
codex-command: "/ops-security-audit"
source: ".claude/commands/ops-security-audit.md"
invocation: "mekong ops-security-audit $ARGUMENTS"
description: "Dependency scan → code audit → config review → remediation plan. 3 commands, ~20 min."
argument-hint: "[ops context or goal]"
allowed-tools: "default"
content-sha256: "de7d8b7d0522980cdfc1d2296988ff8b2b898253ef809d789b276b98e7934777"
---

# /ops-security-audit

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ops-security-audit $ARGUMENTS
```

## Source Command

# Security Audit

> Trigger: `/ops:security-audit $ARGUMENTS`
> Estimated: ~20 min

## Execution

Load recipe: `recipes/ops/security-audit.json`

Run the DAG workflow:

### Security Scan (parallel)
- `security`
- `audit`

### Remediation (sequential)
- `fix`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/security-audit`
5. Report completion with summary
