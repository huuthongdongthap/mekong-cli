---
codex-command: "/sec-secrets"
source: ".claude/commands/sec-secrets.md"
invocation: "mekong sec-secrets $ARGUMENTS"
description: "Secrets management and rotation"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "86f3d64c4b7d3c6f0561cf86c68ed73e840848dcf843a5bd5f3eed03577ddf61"
---

# /sec-secrets

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sec-secrets $ARGUMENTS
```

## Source Command

# /sec:secrets — Secrets Management

**IC super command** — Secrets management and rotation

## Pipeline

```
PARALLEL: vault-check + leak-scan
    |
SEQUENTIAL: rotate-expired
    |
OUTPUT: reports/sec/secrets/
```

## Trigger

Runs recipe `recipes/sec/secrets.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/sec:secrets [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
