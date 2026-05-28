---
codex-command: "/git/fix-issue"
source: ".claude/commands/git/fix-issue.md"
invocation: "mekong git/fix-issue $ARGUMENTS"
description: "Analyze and fix a GitHub issue with structured approach"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "298bc9b041cfb4d3729ee7ed390a8cdceb4ab558e896f88884c848168c2d3ff4"
---

# /git/fix-issue

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong git/fix-issue $ARGUMENTS
```

## Source Command

// turbo

# /fix-issue - GitHub Issue Fixer

Analyze a GitHub issue and implement the fix.

## Usage

```
/fix-issue [issue-number]
```

## Claude Prompt Template

```
Fix GitHub issue workflow:

1. Fetch issue details: gh issue view {number} --json title,body,labels
2. Analyze the issue:
   - Identify root cause
   - Determine affected files
   - Plan implementation
3. Create fix branch: git checkout -b fix/issue-{number}
4. Implement the fix
5. Write tests for the fix
6. Run test suite to verify
7. Create commit: git commit -m "🐛 fix: #{number} {title}"

Report:
- Issue summary
- Changes made
- Files modified
- Test results
```

## Example Output

```
📋 Issue #42: Login button not responsive

🔍 Root cause: Missing onClick handler

📝 Changes:
   - src/components/Login.tsx: Added handler
   - tests/Login.test.tsx: Added test

✅ Tests: 15/15 passed
✅ Committed: fix/issue-42
```
