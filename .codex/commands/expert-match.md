---
codex-command: "/expert-match"
source: ".claude/commands/expert-match.md"
invocation: "mekong expert-match $ARGUMENTS"
description: "AI-powered expert matching — find best expert for portfolio company need. 1 command, ~5 min."
argument-hint: "[company-slug --need="description of need"]"
allowed-tools: "Bash"
content-sha256: "8698fb9d1998e59136a3e91b15422adecf7de7b16abbba3764f7618b8e59fae1"
---

# /expert-match

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong expert-match $ARGUMENTS
```

## Source Command

# /expert:match — Expert Matching

## Engine command

```bash
mekong expert match $ARGUMENTS
```

## Fallback

If engine not ready, run `mekong --help` to check installation, then retry.

## Goal context

<goal>$ARGUMENTS</goal>
