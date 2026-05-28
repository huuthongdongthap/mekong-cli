---
codex-command: "/business-revenue-engine"
source: ".claude/commands/business-revenue-engine.md"
invocation: "mekong business-revenue-engine $ARGUMENTS"
description: "Build complete revenue pipeline — leads, CRM, sales, invoicing, analytics. 7 commands, ~40 min."
argument-hint: "[business context or goal]"
allowed-tools: "default"
content-sha256: "7fa2056a6a1f32ca13a53f32ce8b1e880ab70aae5f29f86f5cff8516e26e4ed2"
---

# /business-revenue-engine

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong business-revenue-engine $ARGUMENTS
```

## Source Command

# Revenue Engine Setup

> Trigger: `/business:revenue-engine $ARGUMENTS`
> Estimated: ~40 min

## Execution

Load recipe: `recipes/business/revenue-engine.json`

Run the DAG workflow:

### Market & Pipeline Research (parallel)
- `market-analysis`
- `customer-research`
- `competitor`

### Build Sales Pipeline (parallel)
- `pipeline`
- `leadgen`

### Operationalize (sequential)
- `crm`
- `sales`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/revenue-engine`
5. Report completion with summary
