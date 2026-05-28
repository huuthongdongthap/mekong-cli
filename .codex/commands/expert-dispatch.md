---
codex-command: "/expert-dispatch"
source: ".claude/commands/expert-dispatch.md"
invocation: "mekong expert-dispatch $ARGUMENTS"
description: "Dispatch expert to portfolio company — create engagement record. 1 command, ~3 min."
argument-hint: "[expert-id --company=slug --scope="engagement scope" --type=advisory]"
allowed-tools: "Bash"
content-sha256: "b2a5430e5cf29d3a96f79ba12cc9898386347ec2fe92829ded429ad3e5a90092"
---

# /expert-dispatch

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong expert-dispatch $ARGUMENTS
```

## Source Command

# /expert:dispatch — Dispatch Expert

## Engine command

```bash
mekong expert dispatch $ARGUMENTS
```

## Fallback

If engine not ready, run `mekong --help` to check installation, then retry.

## Goal context

<goal>$ARGUMENTS</goal>
