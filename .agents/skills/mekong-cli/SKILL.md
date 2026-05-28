---
name: mekong-cli
description: "Configure Mekong CLI command defaults, provider policy, and autonomous execution mode. 3 credits, ~10 min."
---

# /mekong-cli — Mekong CLI Command Config

**Ops command** — manages command defaults for the Mekong CLI itself.

## Pipeline

```
CONFIG: factory/contracts/commands/mekong-cli.json
OUTPUT: .mekong/command-config.json
```

## Codex Auto Policy

For Codex-backed auto mode, use:

```bash
codex --ask-for-approval never --sandbox workspace-write
```

Do not emit deprecated `codex --full-auto` or unsupported `codex --auto` launch commands.

## Goal Context

<goal>$ARGUMENTS</goal>
