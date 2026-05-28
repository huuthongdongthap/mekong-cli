---
codex-command: "/git/create-pr"
source: ".claude/commands/git/create-pr.md"
invocation: "mekong git/create-pr $ARGUMENTS"
description: "Create branch, commit, and submit pull request"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "41662a31d7fcaeb74574f17d172404fd1ca374717e9d9287440faf5190cc0ed3"
---

# /git/create-pr

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong git/create-pr $ARGUMENTS
```

## Source Command

// turbo

# /create-pr - Full PR Workflow

Create a new branch, commit changes, and submit PR in one command.

## Usage

```
/create-pr [title]
```

## Claude Prompt Template

```
Pull Request workflow:

1. Check current branch status
2. Create feature branch if on main:
   git checkout -b feature/{slugified-title}
3. Stage all changes: git add -A
4. Create commit with conventional format
5. Push branch: git push -u origin {branch}
6. Create PR using gh CLI:
   gh pr create --title "{title}" --body "## Changes\n{summary}"

Return PR URL.
```

## Example Output

```
✅ Branch: feature/add-user-auth
✅ Committed: a1b2c3d
✅ Pushed to origin
✅ PR: https://github.com/user/repo/pull/123

🔗 Review: https://github.com/user/repo/pull/123
```
