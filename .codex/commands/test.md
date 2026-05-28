---
codex-command: "/test"
source: ".claude/commands/test.md"
invocation: "mekong test $ARGUMENTS"
description: "Test generation — unit tests, integration tests, edge cases, coverage report. 3 steps, ~15 min."
argument-hint: "[module or function to test]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "ae78c433490119417361e92c369a5723d3933ca626d3ca48325cffed6ee1b301"
---

# /test

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong test $ARGUMENTS
```

## Source Command

# /engineering:test — Test Generator

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── test-plan               → test-plan.md
  ├── test-generation         → tests/
  └── coverage-report         → coverage.md
```

## Output directory: reports/engineering/test/
