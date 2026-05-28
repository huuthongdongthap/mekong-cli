---
codex-command: "/dealflow-close"
source: ".claude/commands/dealflow-close.md"
invocation: "mekong dealflow-close $ARGUMENTS"
description: "Close deal — finalize investment, onboard company to portfolio. 1 command, ~5 min."
argument-hint: "[deal-id]"
allowed-tools: "Bash"
content-sha256: "1ffb33fd45b6ec2f6bbc1fa1cf004d489bfa7f63b991174b087017a88cfb6c44"
---

# /dealflow-close

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong dealflow-close $ARGUMENTS
```

## Source Command

# /dealflow:close — Close Deal & Onboard

## Engine command

```bash
mekong dealflow advance --to-stage closed $ARGUMENTS
```

## Fallback

If engine not ready, run `mekong --help` to check installation, then retry.

## Goal context

<goal>$ARGUMENTS</goal>
