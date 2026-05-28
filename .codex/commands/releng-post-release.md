---
codex-command: "/releng-post-release"
source: ".claude/commands/releng-post-release.md"
invocation: "mekong releng-post-release $ARGUMENTS"
description: "Release post-release — smoke prod, health check, announce in 5 min"
argument-hint: "[version number or release notes]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "714e62e5fafd06a56448aebed4be6854eea0bdaafcacaea7ed51a56bc05077e6"
---

# /releng-post-release

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong releng-post-release $ARGUMENTS
```

## Source Command

# /releng:post-release — Post-Release

**IC super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
PARALLEL: /smoke --prod + /health --all                         (~3 min)
    |
SEQUENTIAL: /email --release-notes                              (~2 min)
    |
OUTPUT: reports/releng/post-release/
```

## Estimated: 3 credits, 5 minutes

## Execution

Load recipe: `recipes/releng/releng-post-release.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
