---
codex-command: "/marketing-performance-report"
source: ".claude/commands/marketing-performance-report.md"
invocation: "mekong marketing-performance-report $ARGUMENTS"
description: "Channel metrics, SEO health audit, ROI analysis, optimization recommendations. 3 commands, ~15 min."
argument-hint: "[time period or channel to audit]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d916c98b246af6f2358e5645c0c7953b80ff4b0cd2a0b4e02f4d3a265e1a7759"
---

# /marketing-performance-report

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong marketing-performance-report $ARGUMENTS
```

## Source Command

# /marketing:performance-report — Marketing Performance

**Super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
PARALLEL: /market-analysis + /seo --audit      (~8 min)
    |
SEQUENTIAL: /general-report                    (~7 min)
    |
OUTPUT: reports/marketing/performance/
```

## Estimated: 10 credits, 15 minutes

## Execution

Load recipe: `recipes/marketing/performance-report.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
