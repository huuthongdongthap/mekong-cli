---
codex-command: "/platform-monitoring-setup"
source: ".claude/commands/platform-monitoring-setup.md"
invocation: "mekong platform-monitoring-setup $ARGUMENTS"
description: "Health checks → alerts → dashboard → runbook for platform monitoring"
argument-hint: "[service or platform to monitor]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "a30faca448f0d9049231345996f1520a91ea7c4b4e8155fe7312905c27402e90"
---

# /platform-monitoring-setup

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong platform-monitoring-setup $ARGUMENTS
```

## Source Command

# /platform:monitoring-setup — Monitoring Setup

**Super command** — chains 4 commands via DAG pipeline.

## Pipeline

```
[health --setup] ══╗
[benchmark --baseline] ╝ (parallel)
                        ▼
              [docs --runbook]
                        │
                        ▼
                    [status]
```

## Estimated: 12 credits, 20 minutes

## Execution

Load recipe: `recipes/platform/monitoring-setup.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
