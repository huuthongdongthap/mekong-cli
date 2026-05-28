---
codex-command: "/engineering-refactor"
source: ".claude/commands/engineering-refactor.md"
invocation: "mekong engineering-refactor $ARGUMENTS"
description: "Audit → plan → refactor → test → verify. Safe large-scale refactoring. 5 commands, ~40 min."
argument-hint: "[engineering context or goal]"
allowed-tools: "default"
content-sha256: "29d37065aec1625392a68e1a76c7fca2a00f590726cec1942965b8a217af6ad1"
---

# /engineering-refactor

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong engineering-refactor $ARGUMENTS
```

## Source Command

# Refactor Pipeline

> Trigger: `/engineering:refactor $ARGUMENTS`
> Estimated: ~40 min

## Execution

Load recipe: `recipes/engineering/refactor.json`

Run the DAG workflow:

### Analyze & Plan (parallel)
- `audit`
- `coverage`

### Refactor (sequential)
- `refactor`
- `test`

### Verify (sequential)
- `review`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/refactor`
5. Report completion with summary
