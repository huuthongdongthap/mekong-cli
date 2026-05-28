---
codex-command: "/sdlc/spec"
source: ".claude/commands/sdlc/spec.md"
invocation: "mekong sdlc/spec $ARGUMENTS"
description: "SDLC phase 1 — Spec: feature idea → requirements. Dispatches to `mekong spec new <feature>`. Scaffolds .mekong/SPEC_OUTPUT.md, prints planner agent prompt."
argument-hint: "[feature-slug, e.g. auth-mfa]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "7ef2a61d970954870eaf7cdf3a929e613d05daefa8f8b3de7bee998eddac6393"
---

# /sdlc/spec

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sdlc/spec $ARGUMENTS
```

## Source Command

# /sdlc:spec — Spec Phase

**Phase 1 of 4** in the agentic SDLC. Reads `CLAUDE.spec.md` contract → scaffolds `SPEC_OUTPUT.md` → prints planner agent prompt.

## Dispatch

```bash
mekong spec new $ARGUMENTS
```

## Output

`.mekong/SPEC_OUTPUT.md` populated with sections: Problem Statement, Objectives, Requirements (functional + non-functional), Metrics, Risks, Out of Scope.

## Next

```bash
mekong design new $ARGUMENTS   # or /sdlc:design $ARGUMENTS
```

## Contract

`.mekong/phases/CLAUDE.spec.md` — planner agent instructions (requirements gathering, user-story format, FR/NFR split, success metrics).

## Related

- `/sdlc` — full flow overview
- `/sdlc:design`, `/sdlc:code`, `/sdlc:deploy` — subsequent phases
