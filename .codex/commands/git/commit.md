---
codex-command: "/git/commit"
source: ".claude/commands/git/commit.md"
invocation: "mekong git/commit $ARGUMENTS"
description: "Create git commit with conventional format and emoji"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "98d83ebf402bbf0f583a29419ad5e666aad0bd0e13775bace5f7ac3d5a969a87"
---

# /git/commit

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong git/commit $ARGUMENTS
```

## Source Command

// turbo

# /commit - Conventional Commit

Create a well-formatted git commit following conventional commit standards.

## Usage

```
/commit [type] [message]
```

## Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

## Claude Prompt Template

```
Analyze the staged changes and create a conventional commit:

1. Run `git diff --staged` to see changes
2. Determine the commit type (feat/fix/docs/etc)
3. Write concise commit message (50 chars max)
4. Add emoji prefix based on type:
   - feat: ✨
   - fix: 🐛
   - docs: 📝
   - style: 💄
   - refactor: ♻️
   - test: ✅
   - chore: 🔧

5. Execute: git commit -m "{emoji} {type}: {message}"

Return the commit SHA.
```

## Example Output

```
✨ feat: add user authentication module
Commit: a1b2c3d
```
