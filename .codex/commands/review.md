---
codex-command: "/review"
source: ".claude/commands/review.md"
invocation: "mekong review $ARGUMENTS"
description: "Code review — architecture check, security scan, performance analysis, improvement suggestions. 3 steps, ~15 min."
argument-hint: "[PR number or file path]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d6bc39dffe37992de10d76b13a4f4d0d2750dc457cb4dcc73317114e516ab58b"
---

# /review

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong review $ARGUMENTS
```

## Source Command

# /engineering:review — Code Review

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── architecture-review     → architecture.md
  ├── security-check          → security.md
  └── improvements            → review-feedback.md
```

## Output directory: reports/engineering/review/
