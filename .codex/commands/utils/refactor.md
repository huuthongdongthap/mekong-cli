---
codex-command: "/utils/refactor"
source: ".claude/commands/utils/refactor.md"
invocation: "mekong utils/refactor $ARGUMENTS"
description: "Refactor file for better readability and performance"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "8f85fc5a91fa3546cf34ec060e847835847670166779d5e2e025977bda7fb23a"
---

# /utils/refactor

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong utils/refactor $ARGUMENTS
```

## Source Command

// turbo

# /refactor - Code Refactorer

Refactor code for better readability and performance.

## Usage

```
/refactor [file]
/refactor --dry-run
```

## Claude Prompt Template

```
Refactoring workflow:

1. Analyze File:
   - Identify code smells
   - Find long functions (>20 lines)
   - Detect duplication
   - Check complexity

2. Plan Refactoring:
   - Extract methods
   - Rename unclear variables
   - Simplify conditionals
   - Remove dead code

3. Apply Changes:
   - Make incremental changes
   - Run tests after each change
   - Maintain git commits

4. Verify:
   - All tests pass
   - No behavior change
   - Improved metrics

Report before/after metrics.
```

## Example Output

```
♻️ Refactor: src/handlers.ts

Before:
- Lines: 450
- Complexity: 28
- Functions: 8

Changes Applied:
1. ✅ Extracted validateInput() (15 lines)
2. ✅ Simplified processData() conditionals
3. ✅ Renamed 'x' to 'userCount'
4. ✅ Removed 12 unused imports

After:
- Lines: 380 (-15%)
- Complexity: 12 (-57%)
- Functions: 12

✅ All tests still pass!
```
