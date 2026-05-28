---
codex-command: "/raas/ops-health-sweep"
source: ".claude/commands/raas/ops-health-sweep.md"
invocation: "mekong raas/ops-health-sweep $ARGUMENTS"
description: "Run operational health checks across systems. 1 command, ~15-20 min."
argument-hint: "[system or component]"
allowed-tools: "Read, Bash, Task, Grep"
content-sha256: "05579b6bcebd5e847837cb45ac5212121b7eb453b13a7b3703267939ca7b4d1c"
---

# /raas/ops-health-sweep

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong raas/ops-health-sweep $ARGUMENTS
```

## Source Command

# /ops-health-sweep — Operations Health Sweep

**Ops** — single command.

## Estimated: 3 credits, 15-20 minutes

## Workflow

[Check System Status] → [Review Logs] → [Identify Issues] → [Run Diagnostics] → [Generate Report] → [Alert if Critical]

## Success Criteria

- All systems checked (API, DB, CDN)
- Error rates below threshold
- Latency metrics acceptable
- Issues logged and prioritized
