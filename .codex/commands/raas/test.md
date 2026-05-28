---
codex-command: "/raas/test"
source: ".claude/commands/raas/test.md"
invocation: "mekong raas/test $ARGUMENTS"
description: "Run tests and validate code quality. 1 command, ~10-20 min."
argument-hint: "[test scope or file]"
allowed-tools: "Read, Bash, Task"
content-sha256: "e0d1ad45d2c182294f00460aab7e25519c5ed62167c7ab060658d3f1c8e0c07a"
---

# /raas/test

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong raas/test $ARGUMENTS
```

## Source Command

# /test — Test Runner

**Engineering** — single command.

## Estimated: 3 credits, 10-20 minutes

## Workflow

```
[Load Tests] → [Run Suite] → [Analyze Coverage] → [Report Failures]
```

## Execution

1. Run test suite (vitest/jest/pytest)
2. Check coverage (target: >80%)
3. Analyze failures
4. Fix failing tests (if auto mode)
5. Report results

## Goal context

<goal>$ARGUMENTS</goal>
