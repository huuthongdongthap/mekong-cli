---
codex-command: "/marketing-seo"
source: ".claude/commands/marketing-seo.md"
invocation: "mekong marketing-seo $ARGUMENTS"
description: "SEO analysis — keyword research, competitor analysis, on-page audit, content gaps. 3 steps, ~20 min."
argument-hint: "[domain or target keywords]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "7cc9a38ff2b64d1e621470e11dd730528a518470d3db10d068275d39d99baefd"
---

# /marketing-seo

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong marketing-seo $ARGUMENTS
```

## Source Command

# /marketing:marketing-seo — SEO Analysis

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── keyword-research        → keywords.md
  ├── competitor-audit        → competitor-analysis.md
  └── content-gaps            → seo-action-plan.md
```

## Output directory: reports/marketing/marketing-seo/
