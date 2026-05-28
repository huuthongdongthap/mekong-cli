---
codex-command: "/git/create-worktrees"
source: ".claude/commands/git/create-worktrees.md"
invocation: "mekong git/create-worktrees $ARGUMENTS"
description: "Create git worktrees for all open PRs or specific branch"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "105bbd5f9fb68ac4dbbf9f3f18f1441c98e85c1aa26fa8ace7a72789572d93a4"
---

# /git/create-worktrees

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong git/create-worktrees $ARGUMENTS
```

## Source Command

// turbo

# /create-worktrees - Git Worktree Manager

Create worktrees for parallel development on multiple branches.

## Usage

```
/create-worktrees [branch]
/create-worktrees --all-prs
```

## Claude Prompt Template

```
Git worktree workflow:

If --all-prs:
1. List all open PRs: gh pr list --json number,headRefName
2. For each PR, create worktree:
   git worktree add ../worktrees/{branch} {branch}
3. Clean up stale worktrees

If specific branch:
1. Create worktree: git worktree add ../worktrees/{branch} {branch}
2. Report location

Handle branches with slashes by replacing with dashes in folder name.
```

## Example Output

```
✅ Created worktrees:
   - ../worktrees/feature-auth (from feature/auth)
   - ../worktrees/fix-login (from fix/login)

📁 Total: 2 worktrees active
```
