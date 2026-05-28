---
codex-command: "/raas/audit"
source: ".claude/commands/raas/audit.md"
invocation: "mekong raas/audit $ARGUMENTS"
description: "Run comprehensive codebase or system audit. 1 command, ~30-60 min."
argument-hint: "[audit scope: security/perf/compliance]"
allowed-tools: "Read, Grep, Task, Bash"
content-sha256: "3ef4001febd04a3c9577b361568ca3fc0967a24f1b919b46f6a445bd65f1a249"
---

# /raas/audit

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong raas/audit $ARGUMENTS
```

## Source Command

# /audit — Audit (Comprehensive Review)

**Ops** — single command.

## Estimated: 5 credits, 30-60 minutes

## Workflow

[Define Scope] → [Scan Codebase] → [Identify Issues] → [Categorize by Severity] → [Generate Report] → [Recommend Fixes]

## Audit Types

- **Security**: OWASP Top 10, secrets exposure
- **Performance**: Bundle size, latency, DB queries
- **Compliance**: Type safety, TODOs, console.logs
- **Architecture**: Tech debt, code duplication
