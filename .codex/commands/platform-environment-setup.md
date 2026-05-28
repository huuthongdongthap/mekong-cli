---
codex-command: "/platform-environment-setup"
source: ".claude/commands/platform-environment-setup.md"
invocation: "mekong platform-environment-setup $ARGUMENTS"
description: "Init → install deps → configure MCP → verify environment setup"
argument-hint: "[environment name or target]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "683667d9f13b036f57a4e6571ee07d4bb0b5a13a532fb08be3cd66ff1db09190"
---

# /platform-environment-setup

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong platform-environment-setup $ARGUMENTS
```

## Source Command

# /platform:environment-setup — Environment Setup

**Super command** — chains 4 commands via DAG pipeline.

## Pipeline

```
[init]
  │
  ▼
[install]
  │
  ▼
[setup-mcp]
  │
  ▼
[health]
```

## Estimated: 5 credits, 10 minutes

## Execution

Load recipe: `recipes/platform/environment-setup.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
