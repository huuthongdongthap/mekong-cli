---
codex-command: "/raas/status"
source: ".claude/commands/raas/status.md"
invocation: "mekong raas/status $ARGUMENTS"
description: "Check system status and metrics. 1 command, ~5-10 min."
argument-hint: "[component or full system]"
allowed-tools: "Read, Bash, Task"
content-sha256: "eee127010524ba0d07deb4305aed12da2f13934509e8dcb5a7d7b15811581c72"
---

# /raas/status

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong raas/status $ARGUMENTS
```

## Source Command

# /status — Status Check

**Ops** — single command.

## Estimated: 1 credit, 5-10 minutes

## Workflow

[Query Metrics] → [Check Uptime] → [Review Errors] → [Display Dashboard] → [Alert if Anomalies]

## Status Output

- Service health (green/yellow/red)
- Active users/sessions
- Error rate (24h)
- Latency p50/p95/p99
- Database connection status
