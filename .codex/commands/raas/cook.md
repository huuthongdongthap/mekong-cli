---
codex-command: "/raas/cook"
source: ".claude/commands/raas/cook.md"
invocation: "mekong raas/cook $ARGUMENTS"
description: "Build/implement features end-to-end. 1 command, ~30-60 min."
argument-hint: "[feature description or plan path]"
allowed-tools: "Read, Write, Edit, Bash, Task, Agent"
content-sha256: "c45f6e104aed37ffd7f8d97b0753c61d160e78d3286a7aa4e46a0bb65ab9c4e4"
---

# /raas/cook

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong raas/cook $ARGUMENTS
```

## Source Command

# /cook — Cook (Smart Feature Implementation)

**Engineering** — single command.

## Estimated: 3 credits, 30-60 minutes

## Workflow

```
[Intent Detection] → [Research?] → [Plan] → [Implement] → [Test] → [Review] → [Finalize]
```

## Modes

| Mode | Research | Testing | Review Gates |
|------|----------|---------|--------------|
| interactive (default) | ✓ | ✓ | User approval at each step |
| --fast | ✗ | ✓ | User approval at each step |
| --auto | ✓ | ✓ | Auto-approve if score≥9.5 |
| --parallel | Optional | ✓ | User approval at each step |
| --no-test | ✓ | ✗ | User approval at each step |

## Execution

1. Detect intent from arguments
2. Research (if needed)
3. Create/update plan in `./plans/`
4. Implement code
5. Test (spawn tester agent)
6. Review (spawn code-reviewer agent)
7. Finalize (spawn project-manager, docs-manager, git-manager)

## Goal context

<goal>$ARGUMENTS</goal>
