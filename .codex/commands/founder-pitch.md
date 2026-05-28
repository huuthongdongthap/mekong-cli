---
codex-command: "/founder-pitch"
source: ".claude/commands/founder-pitch.md"
invocation: "mekong founder-pitch $ARGUMENTS"
description: "Pitch deck creation — problem, solution, market, traction, financials, ask. 6 steps, ~35 min."
argument-hint: "[company name and stage]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "6d2edbe8c1a93e215b518101f754ffe5f55722b3692bd8207d6d40091e96eef4"
---

# /founder-pitch

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong founder-pitch $ARGUMENTS
```

## Source Command

# /venture:founder-pitch — Founder Pitch Deck

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── problem-statement       → problem.md
  ├── solution-design         → solution.md
  ├── market-sizing           → market.md
  ├── traction-metrics        → traction.md
  ├── financial-model         → financials.md
  └── ask-structure           → pitch-deck.md
```

## Output directory: reports/venture/founder-pitch/
