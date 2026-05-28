---
codex-command: "/infra-network"
source: ".claude/commands/infra-network.md"
invocation: "mekong infra-network $ARGUMENTS"
description: "Network architecture audit — segmentation, firewall, DNS"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "58720d60da1c2fde10af79b6573d9d9d7bd8a3ea478120c8c82bd969fb0f04b2"
---

# /infra-network

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong infra-network $ARGUMENTS
```

## Source Command

# /infra:network — Network Audit

**IC super command** — Network architecture audit — segmentation, firewall, DNS

## Pipeline

```
PARALLEL: scan-firewall + scan-dns + scan-segments\nSEQUENTIAL: audit-report
```

## Trigger

Runs recipe `recipes/infra/network.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/infra:network [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
