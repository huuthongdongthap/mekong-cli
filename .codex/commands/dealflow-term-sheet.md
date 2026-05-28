---
codex-command: "/dealflow-term-sheet"
source: ".claude/commands/dealflow-term-sheet.md"
invocation: "mekong dealflow-term-sheet $ARGUMENTS"
description: "Generate term sheet draft from deal data and studio defaults. 1 command, ~8 min."
argument-hint: "[deal-id]"
allowed-tools: "Bash"
content-sha256: "a321da3f99283eb1b5a5fad0c4c146900190f5081fecadf532df8fa2d298976a"
---

# /dealflow-term-sheet

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong dealflow-term-sheet $ARGUMENTS
```

## Source Command

# /dealflow:term-sheet — Generate Term Sheet

## Engine command

```bash
mekong dealflow advance --to-stage term_sheet $ARGUMENTS
```

## Fallback

If engine not ready, run `mekong --help` to check installation, then retry.

## Goal context

<goal>$ARGUMENTS</goal>
