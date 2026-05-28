---
codex-command: "/devrel-docs"
source: ".claude/commands/devrel-docs.md"
invocation: "mekong devrel-docs $ARGUMENTS"
description: "API reference generation and versioning"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "1d33784bfaa727745e12032c316514afeae9c683eee6ac10cd7cff515e2a597b"
---

# /devrel-docs

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong devrel-docs $ARGUMENTS
```

## Source Command

# /devrel:docs — API Docs

**IC super command** — API reference generation and versioning

## Pipeline

```
SEQUENTIAL: extract-openapi → generate-docs → version-publish
```

## Trigger

Runs recipe `recipes/devrel/docs.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/devrel:docs [goal]
```

## Estimated: 3 credits, 10 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
