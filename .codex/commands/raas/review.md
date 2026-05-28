---
codex-command: "/raas/review"
source: ".claude/commands/raas/review.md"
invocation: "mekong raas/review $ARGUMENTS"
description: "Code review with scout-based edge case detection. 1 command, ~10-20 min."
argument-hint: "[file/path to review]"
allowed-tools: "Read, Grep, Task"
content-sha256: "92e11c9315b3a3b22eb9bf70d5b1a58a03f9d5cce29b52f7c1baa7d2d9ef5f14"
---

# /raas/review

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong raas/review $ARGUMENTS
```

## Source Command

# /review — Code Review

**Engineering** — single command.

## Estimated: 1 credit, 10-20 minutes

## Workflow

```
[Read Code] → [Scout Edge Cases] → [Security Audit] → [Performance Check] → [Report]
```

## Review Checklist

- [ ] Code follows established patterns
- [ ] No security vulnerabilities (OWASP Top 10)
- [ ] Error handling complete
- [ ] Type safety (no any types)
- [ ] No console.log pollution
- [ ] Tests cover edge cases
- [ ] Performance optimized

## Output

Review report at `./plans/reports/review-{date}-{slug}.md`

## Goal context

<goal>$ARGUMENTS</goal>
