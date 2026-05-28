---
codex-command: "/worker-scan"
source: ".claude/commands/worker-scan.md"
invocation: "mekong worker-scan $ARGUMENTS"
description: "Scan codebase for issues: tech debt, security, code quality"
argument-hint: "[scope: full|security|debt|quality]"
allowed-tools: "default"
content-sha256: "c6b16fe7eaae2f4060e4b87f70bff3274a2cbb98d4f4207b4b36ad0d2f6b689a"
---

# /worker-scan

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong worker-scan $ARGUMENTS
```

## Source Command

# /worker-scan — Worker Operation

Comprehensive codebase scan.

1. Tech debt: TODO/FIXME/HACK count
2. Security: exposed secrets, vulnerable deps
3. Quality: TypeScript errors, lint issues
4. Report with prioritized fixes
