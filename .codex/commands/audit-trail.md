---
codex-command: "/audit-trail"
source: ".claude/commands/audit-trail.md"
invocation: "mekong audit-trail $ARGUMENTS"
description: "Audit trail extraction — event log, access history, change tracking. 2 steps, ~10 min."
argument-hint: "[system or time period]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "fca17d9f602a03a19279d2325d459431b108a98a19f19fae8ecdafd2889087ba"
---

# /audit-trail

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong audit-trail $ARGUMENTS
```

## Source Command

# /compliance:audit-trail — Audit Trail

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── event-extraction        → event-log.md
  └── trail-analysis          → audit-trail-report.md
```

## Output directory: reports/compliance/audit-trail/
