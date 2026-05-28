---
codex-command: "/audit-compliance"
source: ".claude/commands/audit-compliance.md"
invocation: "mekong audit-compliance $ARGUMENTS"
description: "Full compliance audit — policy review, gap analysis, remediation plan. 3 steps, ~25 min."
argument-hint: "[framework: SOC2 / ISO27001 / GDPR / HIPAA]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d432c9787e99d8cb458adccdf8c60a3a559140abf117fab0b70605b70a2f2f7b"
---

# /audit-compliance

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong audit-compliance $ARGUMENTS
```

## Source Command

# /compliance:audit-compliance — Compliance Audit

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── policy-review           → policy-gaps.md
  ├── gap-analysis            → findings-report.md
  └── remediation-plan        → action-items.md
```

## Output directory: reports/compliance/audit-compliance/
