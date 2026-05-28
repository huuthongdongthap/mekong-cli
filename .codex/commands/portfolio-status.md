---
codex-command: "/portfolio-status"
source: ".claude/commands/portfolio-status.md"
invocation: "mekong portfolio-status $ARGUMENTS"
description: "Portfolio company health dashboard — metrics, momentum, alerts. 1 command, ~3 min."
argument-hint: "[company-slug or --all]"
allowed-tools: "Bash"
content-sha256: "2a77f6b9888d1e3569e558e383d615b67dbd4eea6e867339341719b865acdb33"
---

# /portfolio-status

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong portfolio-status $ARGUMENTS
```

## Source Command

# /portfolio:status — Portfolio Health Dashboard

## Engine command

```bash
mekong portfolio status $ARGUMENTS
```

## Fallback

If engine not ready, run `mekong --help` to check installation, then retry.

## Goal context

<goal>$ARGUMENTS</goal>
