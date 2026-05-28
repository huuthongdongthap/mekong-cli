---
codex-command: "/business-hiring-sprint"
source: ".claude/commands/business-hiring-sprint.md"
invocation: "mekong business-hiring-sprint $ARGUMENTS"
description: "End-to-end recruiting — JD, sourcing, interview kit, comp benchmarking. 4 commands, ~20 min."
argument-hint: "[business context or goal]"
allowed-tools: "default"
content-sha256: "5c27fb2cccf7d7ecc79b77976692a627989ac744d11212fe3fa3197eabb06231"
---

# /business-hiring-sprint

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong business-hiring-sprint $ARGUMENTS
```

## Source Command

# Hiring Sprint

> Trigger: `/business:hiring-sprint $ARGUMENTS`
> Estimated: ~20 min

## Execution

Load recipe: `recipes/business/hiring-sprint.json`

Run the DAG workflow:

### Job Preparation (parallel)
- `hr-management`
- `budget`

### Sourcing & Screening (sequential)
- `leadgen`
- `schedule`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/hiring`
5. Report completion with summary
