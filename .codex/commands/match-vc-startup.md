---
codex-command: "/match-vc-startup"
source: ".claude/commands/match-vc-startup.md"
invocation: "mekong match-vc-startup $ARGUMENTS"
description: "Match VC investors to portfolio company for follow-on/co-invest. 1 command, ~5 min."
argument-hint: "[company-slug]"
allowed-tools: "Bash"
content-sha256: "1247e1a7932c3d0889c1bbbf8e5b0292c88945c8eb4128d2b992d5f767c55533"
---

# /match-vc-startup

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong match-vc-startup $ARGUMENTS
```

## Source Command

# /match:vc-startup — VC-Startup Matching

## Engine command

```bash
mekong match vc-startup $ARGUMENTS
```

## Fallback

If engine not ready, run `mekong --help` to check installation, then retry.

## Goal context

<goal>$ARGUMENTS</goal>
