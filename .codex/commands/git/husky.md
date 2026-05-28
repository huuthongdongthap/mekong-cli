---
codex-command: "/git/husky"
source: ".claude/commands/git/husky.md"
invocation: "mekong git/husky $ARGUMENTS"
description: "Setup and manage Husky Git hooks"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "6f9e437f1f3523bc351fef1178b1337d0a93c2cebe621c33c79e68059eeab18a"
---

# /git/husky

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong git/husky $ARGUMENTS
```

## Source Command

// turbo

# /husky - Git Hooks Manager

Configure Husky for pre-commit hooks and commit standards.

## Usage

```
/husky setup
/husky add [hook-type]
```

## Claude Prompt Template

```
Husky setup workflow:

For 'setup':
1. Install husky: npx husky-init && npm install
2. Configure pre-commit hook:
   - Run linting
   - Run type checking
   - Run tests
3. Configure commit-msg hook:
   - Validate conventional commit format
4. Update package.json scripts

For 'add [hook-type]':
1. Create hook file: npx husky add .husky/{hook-type}
2. Add appropriate commands
3. Make executable

Report hook configuration.
```

## Example Output

```
🪝 Husky Setup Complete

Hooks configured:
- pre-commit: lint + typecheck
- commit-msg: conventional commit validation
- pre-push: test suite

📁 Created: .husky/pre-commit, .husky/commit-msg
```
