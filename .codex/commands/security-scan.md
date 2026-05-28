---
codex-command: "/security-scan"
source: ".claude/commands/security-scan.md"
invocation: "mekong security-scan $ARGUMENTS"
description: "Security scan — vulnerability assessment, dependency audit, configuration review. 3 steps, ~15 min."
argument-hint: "[codebase or system]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "32fe5181bcba0159b43ebf69f4c31d9804d6083027dce305238cc41fda41cde2"
---

# /security-scan

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong security-scan $ARGUMENTS
```

## Source Command

# /security:security-scan — Security Scan

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── vulnerability-scan      → vulnerabilities.md
  ├── dependency-audit        → dependencies.md
  └── config-review           → security-report.md
```

## Output directory: reports/security/security-scan/
