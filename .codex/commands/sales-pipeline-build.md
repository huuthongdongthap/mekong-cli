---
codex-command: "/sales-pipeline-build"
source: ".claude/commands/sales-pipeline-build.md"
invocation: "mekong sales-pipeline-build $ARGUMENTS"
description: "Build complete sales pipeline — ICP profile, lead list, outreach sequences, CRM setup. 5 commands, ~30 min."
argument-hint: "[goal or target market]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "9488a587c6e237b38c313aa8ee958a09fdebf540dc264b882fe9921b856530b4"
---

# /sales-pipeline-build

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sales-pipeline-build $ARGUMENTS
```

## Source Command

# /sales:pipeline-build — Pipeline Builder

**Super command** — chains 5 commands via DAG pipeline.

## Pipeline

```
PARALLEL: /customer-research + /leadgen        (~10 min)
    |
PARALLEL: /pipeline + /email                   (~10 min)
    |
SEQUENTIAL: /crm                               (~10 min)
    |
OUTPUT: reports/sales/pipeline/
```

## Estimated: 20 credits, 30 minutes

## Execution

Load recipe: `recipes/sales/pipeline-build.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
