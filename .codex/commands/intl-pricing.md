---
codex-command: "/intl-pricing"
source: ".claude/commands/intl-pricing.md"
invocation: "mekong intl-pricing $ARGUMENTS"
description: "Geo-specific pricing and PPP adjustments"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "8090520d19a92f48de5f07341cc916d0e04643aab8131c7806a62c3ce01c6d04"
---

# /intl-pricing

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong intl-pricing $ARGUMENTS
```

## Source Command

# /intl:pricing — Geo Pricing

**IC super command** — Geo-specific pricing and PPP adjustments

## Pipeline

```
SEQUENTIAL: benchmark-market → calculate-ppp → set-tiers
```

## Trigger

Runs recipe `recipes/intl/pricing.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/intl:pricing [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
