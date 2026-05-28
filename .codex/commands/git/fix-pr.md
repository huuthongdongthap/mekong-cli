---
codex-command: "/git/fix-pr"
source: ".claude/commands/git/fix-pr.md"
invocation: "mekong git/fix-pr $ARGUMENTS"
description: "Address unresolved PR review comments"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "6cca8048ef2cf9a1ebb8681a37ea3381bb055c158c11d229f83334594148c4f6"
---

# /git/fix-pr

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong git/fix-pr $ARGUMENTS
```

## Source Command

// turbo

# /fix-pr - PR Comment Fixer

Fetch and fix all unresolved PR review comments.

## Usage

```
/fix-pr [pr-number]
```

## Claude Prompt Template

```
Fix PR comments workflow:

1. Fetch PR review comments:
   gh pr view {number} --json reviews,comments
2. List unresolved comments
3. For each comment:
   - Understand the feedback
   - Make targeted code changes
   - Mark as resolved if possible
4. Commit fixes: git commit -m "♻️ refactor: address PR review #{number}"
5. Push updates

Report:
- Comments addressed
- Changes made
- Remaining items
```

## Example Output

```
📋 PR #55: Add authentication

💬 Comments to address: 3
   1. ✅ "Add error handling" → Added try/catch
   2. ✅ "Use const instead of let" → Fixed
   3. ✅ "Add JSDoc" → Added documentation

✅ All comments addressed
✅ Pushed to feature/auth
```
