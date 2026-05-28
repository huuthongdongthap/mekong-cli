---
codex-command: "/venture-portfolio"
source: ".claude/commands/venture-portfolio.md"
invocation: "mekong venture-portfolio $ARGUMENTS"
description: "Portfolio review — company updates, performance tracking, follow-on decisions. 3 steps, ~20 min."
argument-hint: "[portfolio or fund name]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "8fac9eb265d4ec8b75c5a5ad34efa93793db9c896253bf1db795807bd370df45"
---

# /venture-portfolio

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong venture-portfolio $ARGUMENTS
```

## Source Command

# /venture:venture-portfolio — Venture Portfolio Review

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── company-updates         → updates.md
  ├── performance-tracking    → performance.md
  └── follow-on-analysis      → portfolio-review.md
```

## Output directory: reports/venture/venture-portfolio/
