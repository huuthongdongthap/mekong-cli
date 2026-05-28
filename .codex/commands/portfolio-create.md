---
codex-command: "/portfolio-create"
source: ".claude/commands/portfolio-create.md"
invocation: "mekong portfolio-create $ARGUMENTS"
description: "Create new portfolio company with OpenClaw CTO instance. 1 command, ~5 min."
argument-hint: "[company-name --sector=ai --stage=idea --equity=30]"
allowed-tools: "Bash"
content-sha256: "b571a5075d2ffc80a9e24360da093b50dd2656d8edba31044e79d723f8cee410"
---

# /portfolio-create

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong portfolio-create $ARGUMENTS
```

## Source Command

# /portfolio:create — Create Portfolio Company

## Engine command

```bash
mekong portfolio create $ARGUMENTS
```

## Fallback

If engine not ready, run `mekong --help` to check installation, then retry.

## Goal context

<goal>$ARGUMENTS</goal>
