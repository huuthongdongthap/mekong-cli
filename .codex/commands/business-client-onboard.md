---
codex-command: "/business-client-onboard"
source: ".claude/commands/business-client-onboard.md"
invocation: "mekong business-client-onboard $ARGUMENTS"
description: "New client setup — contract, project setup, kickoff deck, schedule. 4 commands, ~15 min."
argument-hint: "[business context or goal]"
allowed-tools: "default"
content-sha256: "23def3aee98cb36e6c736eb6bab0840b9eb8a286df8e723b41d1972f365e7bce"
---

# /business-client-onboard

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong business-client-onboard $ARGUMENTS
```

## Source Command

# Client Onboarding

> Trigger: `/business:client-onboard $ARGUMENTS`
> Estimated: ~15 min

## Execution

Load recipe: `recipes/business/client-onboard.json`

Run the DAG workflow:

### Contract & Agreement (parallel)
- `agreement`
- `client`

### Project Kickoff (sequential)
- `project-management`
- `schedule`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/onboarding`
5. Report completion with summary
