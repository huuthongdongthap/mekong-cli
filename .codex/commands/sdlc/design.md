---
codex-command: "/sdlc/design"
source: ".claude/commands/sdlc/design.md"
invocation: "mekong sdlc/design $ARGUMENTS"
description: "SDLC phase 2 — Design: requirements → architecture. Reads SPEC_OUTPUT.md, scaffolds DESIGN_OUTPUT.md, prints architect agent prompt."
argument-hint: "[feature-slug, e.g. auth-mfa]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "29219360efb0b7ded2f345ce9b2a38c9935ee49103df739e43dcfc3e4ddbfe84"
---

# /sdlc/design

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sdlc/design $ARGUMENTS
```

## Source Command

# /sdlc:design — Design Phase

**Phase 2 of 4** in the agentic SDLC. Reads `SPEC_OUTPUT.md` + `CLAUDE.design.md` contract → scaffolds `DESIGN_OUTPUT.md` → prints architect agent prompt.

## Dispatch

```bash
mekong design new $ARGUMENTS
```

## Output

`.mekong/DESIGN_OUTPUT.md` populated with: Architecture Overview, Component Diagram, ADR (Architecture Decision Records), File Ownership Matrix, API/Schema changes, Risk assessment.

## Next

```bash
mekong code new $ARGUMENTS   # or /sdlc:code $ARGUMENTS
```

## Contract

`.mekong/phases/CLAUDE.design.md` — architect agent instructions (ADR format, file-ownership declaration, concurrency considerations).

## Related

- `/sdlc` — full flow overview
- `/sdlc:spec` ← previous phase
- `/sdlc:code` → next phase
