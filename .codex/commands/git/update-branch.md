---
codex-command: "/git/update-branch"
source: ".claude/commands/git/update-branch.md"
invocation: "mekong git/update-branch $ARGUMENTS"
description: "Update branch name with proper prefix and format"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "41419d85f3fe7afb5cfab35d7f4d7933ea10ac0e2fdccba59a124bc271af26b5"
---

# /git/update-branch

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong git/update-branch $ARGUMENTS
```

## Source Command

// turbo

# /update-branch - Branch Renamer

Rename current branch with proper naming conventions.

## Usage

```
/update-branch [new-name]
```

## Prefixes

- `feature/` - New features
- `fix/` - Bug fixes
- `hotfix/` - Urgent fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation
- `test/` - Test additions

## Claude Prompt Template

```
Branch rename workflow:

1. Get current branch: git branch --show-current
2. If new-name doesn't have prefix, add appropriate one
3. Slugify the name (lowercase, hyphens)
4. Rename local: git branch -m {old} {new}
5. If remote exists:
   - Delete old remote: git push origin --delete {old}
   - Push new: git push -u origin {new}

Report old and new branch names.
```

## Example Output

```
🌿 Branch Renamed

Old: my-feature
New: feature/my-feature

✅ Local renamed
✅ Remote updated
```
