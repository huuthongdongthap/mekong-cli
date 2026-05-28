---
codex-command: "/raas/plan"
source: ".claude/commands/raas/plan.md"
invocation: "mekong raas/plan $ARGUMENTS"
description: "Create implementation plans with TODO tasks. 1 command, ~5-10 min."
argument-hint: "[what to plan]"
allowed-tools: "Read, Write, Task"
content-sha256: "959785399860b2a30426a91da6b307244211c1452859054c0710923c16a4c9d3"
---

# /raas/plan

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong raas/plan $ARGUMENTS
```

## Source Command

# /plan — Plan (Implementation Planning)

**Product** — single command.

## Estimated: 1 credit, 5-10 minutes

## Workflow

```
[Research] → [Scout] → [Create Plan] → [Output plan.md]
```

## Output

Plan file at `./plans/{date}-{slug}/plan.md` containing:
- Overview with status/progress
- Key insights from research
- Requirements (functional/non-functional)
- Architecture decisions
- Related code files
- Implementation steps
- Success criteria
- Risk assessment

## Goal context

<goal>$ARGUMENTS</goal>
