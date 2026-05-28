---
codex-command: "/legal-contract-review"
source: ".claude/commands/legal-contract-review.md"
invocation: "mekong legal-contract-review $ARGUMENTS"
description: "Contract review — analyze contract → flag risks → suggest amendments → negotiation brief"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "a693113d9f104e4450f61c60c8f57f0dfbf1b577d1a83a2105a0728e284b1286"
---

# /legal-contract-review

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong legal-contract-review $ARGUMENTS
```

## Source Command

# /legal:contract-review — Contract Review

**Super command** — chains 3 commands via DAG pipeline.

## Pipeline

```
[analyze] ──────────────────────────────────────── PARALLEL
  ├── agreement --review        → risk-analysis.md
  └── market-analysis           → market-terms.md
         │
         ▼
[negotiate] ────────────────────────────────────── SEQUENTIAL
  └── contract                  → amendment-suggestions.md
```

## Estimated: 12 credits, 15 minutes

## Execution

Load recipe: `recipes/legal/contract-review.json`

Execute DAG groups in dependency order:
- If mode = "parallel": spawn multiple subagents simultaneously via Task tool
- If mode = "sequential": run commands one after another
- Wait for group completion before starting dependent groups

## Goal context

<goal>$ARGUMENTS</goal>
