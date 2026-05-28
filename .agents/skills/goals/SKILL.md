---
name: goals
description: "Founder goals deep configuration — translate a goal into operating rules, Codex auto mode, metrics, and next actions. 3 credits, ~10 min."
---

# /goals — Founder Goal Configuration

**Founder command** — turns a business or engineering goal into an executable operating config.

## Pipeline

```
DELEGATION: goals → founder:* → pm:okr → dev:*
OUTPUT: reports/founder/goals/
```

## Estimated

3 credits, ~10 minutes

## Execution

Load recipe: `recipes/founder/goals.json`
Load contract: `factory/contracts/commands/goals.json`

Execute DAG groups in dependency order:
- `deep-config`: inspect current command, adapter, and contract config
- `codex-auto`: verify Codex autonomous launch flags and CLI command compatibility
- `goal-output`: write the resulting goal spec, success metrics, risks, and next steps

## Contract Inputs

Accepted structured config fields:
- `provider`: `auto`, `codex`, `claude`, `gemini`, `opencode`, or `aider`
- `mode`: `plan` or `auto`
- `sandbox`: `read-only`, `workspace-write`, or `danger-full-access`
- `approval_policy`: `untrusted`, `on-request`, or `never`
- `codex_auto_command`: resolved command string for Codex-backed autonomous execution

## Codex Auto Policy

For Codex-backed execution, use the current Codex CLI auto-mode equivalent:

```bash
codex --ask-for-approval never --sandbox workspace-write
```

Do not emit deprecated `codex --full-auto` or unsupported `codex --auto` launch commands.

## Goal Context

<goal>$ARGUMENTS</goal>
