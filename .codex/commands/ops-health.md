---
codex-command: "/ops-health"
source: ".claude/commands/ops-health.md"
invocation: "mekong ops-health $ARGUMENTS"
description: "Operations health check — system status, capacity planning, bottleneck analysis. 3 steps, ~15 min."
argument-hint: "[system or service name]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "b8e8fc9f340e34bf80f3387c0f493af30de3068b2b4d04eb2f90589effeb3587"
---

# /ops-health

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ops-health $ARGUMENTS
```

## Source Command

# /ops:ops-health — Operations Health Check

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── status-check            → system-status.md
  ├── capacity-analysis       → capacity.md
  └── bottleneck-report       → health-report.md
```

## Output directory: reports/ops/ops-health/
