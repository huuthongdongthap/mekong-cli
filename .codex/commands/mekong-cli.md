---
codex-command: "/mekong-cli"
source: ".claude/commands/mekong-cli.md"
invocation: "mekong mekong-cli $ARGUMENTS"
description: "Configure Mekong CLI command defaults, provider policy, and autonomous execution mode. 3 credits, ~10 min."
argument-hint: "[command config goal]"
allowed-tools: "Read, Write, Bash"
content-sha256: "6439cd8700bc13e10d3d24d20318638c2ce30d0f63e68df83fa146a4fe3b8667"
---

# /mekong-cli

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong mekong-cli $ARGUMENTS
```

## Source Command

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
