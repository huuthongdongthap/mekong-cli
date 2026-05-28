---
codex-command: "/obs-trace"
source: ".claude/commands/obs-trace.md"
invocation: "mekong obs-trace $ARGUMENTS"
description: "OpenTelemetry distributed tracing setup and analysis"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "cc086c481bc47cba1984f88d1aaa610ab8a3f02e801deba4d22e1d792b7ac0de"
---

# /obs-trace

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong obs-trace $ARGUMENTS
```

## Source Command

# /obs:trace — Distributed Tracing
**IC super command** — OpenTelemetry distributed tracing setup and analysis
## Pipeline
```
SEQUENTIAL: configure-otel → collect-traces → analyze
```
## Trigger
Runs recipe `recipes/obs/trace.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/obs:trace [goal]
```
## Estimated: 3 credits, 10 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
