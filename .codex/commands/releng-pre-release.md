---
codex-command: "/releng-pre-release"
source: ".claude/commands/releng-pre-release.md"
invocation: "mekong releng-pre-release $ARGUMENTS"
description: "Release pre-release — full test suite, changelog, version bump, tag in 10 min"
argument-hint: "[version number e.g. v1.2.0]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "a073e6eb32296eb099fa08f76ed903e12c133a21d17f025c94d63ce836a88b1f"
---

# /releng-pre-release

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong releng-pre-release $ARGUMENTS
```

## Source Command

# /releng:pre-release — Pre-Release

**IC super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
PARALLEL: /test --all + /docs-changelog                         (~6 min)
    |
SEQUENTIAL: /git-tag                                            (~4 min)
    |
OUTPUT: reports/releng/pre-release/
```

## Estimated: 5 credits, 10 minutes

## Execution

Load recipe: `recipes/releng/releng-pre-release.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
