---
codex-command: "/sales-deal-close"
source: ".claude/commands/sales-deal-close.md"
invocation: "mekong sales-deal-close $ARGUMENTS"
description: "Research buyer, build proposal, pricing strategy, closing playbook. 4 commands, ~20 min."
argument-hint: "[deal name or buyer company]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "300e34424e126e03674a73ab559d59a1eeaf19b0249d1220472e34ce85084c83"
---

# /sales-deal-close

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sales-deal-close $ARGUMENTS
```

## Source Command

# /sales:deal-close — Deal Closer

**Super command** — chains 4 commands via DAG pipeline.

## Pipeline

```
PARALLEL: /customer-research + /competitor     (~8 min)
    |
SEQUENTIAL: /proposal → /close                 (~12 min)
    |
OUTPUT: reports/sales/deal/
```

## Estimated: 15 credits, 20 minutes

## Execution

Load recipe: `recipes/sales/deal-close.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
