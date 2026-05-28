---
codex-command: "/product-launch-feature"
source: ".claude/commands/product-launch-feature.md"
invocation: "mekong product-launch-feature $ARGUMENTS"
description: "Spec → build → test → ship → announce. 5 commands, ~40 min."
argument-hint: "[product context or goal]"
allowed-tools: "default"
content-sha256: "f5dca51ea7a761a4864bf29cf49ef9734985adceee6f8bcbd1883bd0b1c4771f"
---

# /product-launch-feature

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong product-launch-feature $ARGUMENTS
```

## Source Command

# Feature Launch Pipeline

> Trigger: `/product:launch-feature $ARGUMENTS`
> Estimated: ~40 min

## Execution

Load recipe: `recipes/product/launch-feature.json`

Run the DAG workflow:

### Specification (sequential)
- `scope`
- `proposal`

### Build & Test (sequential)
- `cook`
- `test`

### Ship & Announce (sequential)
- `handoff`


## Instructions

1. Read recipe DAG definition
2. Execute groups in dependency order
3. Parallel groups run simultaneously
4. Write outputs to `reports/feature-launch`
5. Report completion with summary
