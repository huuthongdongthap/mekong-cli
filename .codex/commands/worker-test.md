---
codex-command: "/worker-test"
source: ".claude/commands/worker-test.md"
invocation: "mekong worker-test $ARGUMENTS"
description: "Run tests with coverage reporting and failure analysis"
argument-hint: "[scope: unit|integration|e2e|all]"
allowed-tools: "default"
content-sha256: "9d7743e65e605e19814d95aa546d72a95d608a7f42accd039cc2879893e34f1f"
---

# /worker-test

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong worker-test $ARGUMENTS
```

## Source Command

# /worker-test — Worker Operation

Run and analyze tests.

1. Execute test suite for scope
2. Capture coverage metrics
3. Analyze failures
4. Report: pass rate, coverage, failing tests
