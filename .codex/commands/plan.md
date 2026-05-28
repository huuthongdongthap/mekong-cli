---
codex-command: "/plan"
source: ".claude/commands/plan.md"
invocation: "mekong plan $ARGUMENTS"
description: "Create implementation plan with research and analysis"
argument-hint: "<task description>"
allowed-tools: "default"
content-sha256: "006474d4f93b1ba3f6e6c3c32610ee44e42bd414f9a3185c2b3463b9abc314c6"
---

# /plan

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong plan $ARGUMENTS
```

## Source Command

# Plan — Implementation Planning

**Mode:** $1 (default: standard)
**Task:** $ARGUMENTS

## Mode Detection

| Mode | Behavior |
|------|----------|
| `hard` | Deep research → multi-phase plan → detailed steps |
| `fast` | Quick scout → single-phase plan → key steps only |
| (default) | Balanced research → structured plan |

## Instructions

1. **Scout** the codebase to understand current state
2. **Research** the technical approach (skip if fast mode)
3. **Create plan** in `plans/` directory following the naming convention from hook injection
4. **Break into phases** with clear TODO checklists
5. **Ask user** to review before implementation

## Plan Structure

```
plans/{date}-{slug}/
├── plan.md              # Overview (< 80 lines)
├── phase-01-*.md        # Detailed phase files
├── phase-02-*.md
└── ...
```

## Hard Mode (deep analysis)

When mode is `hard`:
- Use multiple researcher subagents in parallel
- Analyze architecture implications
- Include risk assessment and alternatives
- Create detailed phase files with step-by-step instructions
- Include success criteria and validation methods

## Fast Mode (quick planning)

When mode is `fast`:
- Scout only, skip deep research
- Single plan.md file (no separate phases)
- Bullet-point steps
- Focus on what to change, not why
