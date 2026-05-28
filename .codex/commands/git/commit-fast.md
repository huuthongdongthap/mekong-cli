---
codex-command: "/git/commit-fast"
source: ".claude/commands/git/commit-fast.md"
invocation: "mekong git/commit-fast $ARGUMENTS"
description: "Auto-select first commit suggestion and commit immediately"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "44fff5a9a56ea22bbfd3c92afbdcf04a53383290dcd85cfe0165c03712840de1"
---

# /git/commit-fast

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong git/commit-fast $ARGUMENTS
```

## Source Command

// turbo

# /commit-fast - Quick Commit

Skip manual confirmation, auto-select first suggested commit message.

## Usage

```
/commit-fast
```

## Claude Prompt Template

```
Fast commit workflow:

1. Run `git diff --staged` to see changes
2. Generate 3 commit message options
3. Auto-select the first (best) option
4. Execute commit immediately
5. Skip Claude co-authorship footer

Output only the commit result.
```

## Example Output

```
✅ Committed: a1b2c3d
   Message: 🔧 chore: update dependencies
```
