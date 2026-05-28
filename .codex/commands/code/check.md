---
codex-command: "/code/check"
source: ".claude/commands/code/check.md"
invocation: "mekong code/check $ARGUMENTS"
description: "Comprehensive code quality and security check"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "d1fe3a0d719fceb40dec201440c1de40e54fd35caa28cd878b5c63d7a7ca3d89"
---

# /code/check

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong code/check $ARGUMENTS
```

## Source Command

// turbo

# /check - Code Quality Scanner

Full codebase analysis for quality, security, and style.

## Usage

```
/check [path]
/check --fix
```

## Claude Prompt Template

```
Code quality check workflow:

1. Static Analysis:
   - Python: ruff check {path}
   - TypeScript: tsc --noEmit
   - ESLint: eslint {path}

2. Security Scan:
   - Check for hardcoded secrets
   - Dependency vulnerabilities
   - SQL injection patterns

3. Code Style:
   - Formatting compliance
   - Naming conventions
   - Comment quality

4. Metrics:
   - Cyclomatic complexity
   - Code duplication
   - Test coverage

Report all issues with severity levels.
If --fix: auto-fix what's possible.
```

## Example Output

```
🔍 Code Check: src/

Quality: 92/100
Security: ✅ No issues
Style: 3 warnings

Issues:
⚠️ src/auth.ts:42 - Complexity too high (15)
⚠️ src/utils.ts:88 - Unused variable 'temp'
ℹ️ src/api.ts:12 - Consider using const

Auto-fixable: 2 issues
Run /check --fix to apply.
```
