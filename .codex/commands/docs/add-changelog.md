---
codex-command: "/docs/add-changelog"
source: ".claude/commands/docs/add-changelog.md"
invocation: "mekong docs/add-changelog $ARGUMENTS"
description: "Add entry to changelog following Keep a Changelog format"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "cddf35717b7e8c921727e933b0f447f1c87361e8655804aef1ef75ceb6758a8d"
---

# /docs/add-changelog

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong docs/add-changelog $ARGUMENTS
```

## Source Command

// turbo

# /add-changelog - Changelog Entry

Add new entry to CHANGELOG.md following Keep a Changelog format.

## Usage

```
/add-changelog [type] [description]
```

## Types

- `added` - New features
- `changed` - Changes to existing functionality
- `deprecated` - Features to be removed
- `removed` - Removed features
- `fixed` - Bug fixes
- `security` - Security fixes

## Claude Prompt Template

```
Changelog workflow:

1. Read current CHANGELOG.md
2. Find or create [Unreleased] section
3. Find or create appropriate category (Added/Changed/Fixed/etc)
4. Add entry with format: "- {description}"
5. Maintain chronological order (newest first)
6. Save file

If no CHANGELOG.md exists, create with proper header.
```

## Example Output

```
📝 Changelog Updated

Added to [Unreleased] → Fixed:
- Resolve login timeout on slow connections

CHANGELOG.md updated ✅
```
