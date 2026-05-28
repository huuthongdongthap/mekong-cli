---
codex-command: "/marketing-brand"
source: ".claude/commands/marketing-brand.md"
invocation: "mekong marketing-brand $ARGUMENTS"
description: "Brand strategy — positioning, voice, visual identity guidelines, messaging framework. 4 steps, ~30 min."
argument-hint: "[brand or product name]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "dfbe1407fc9b970a9de7f87ba536290d1d12a3173ce159a54a2c58b2ceee01dd"
---

# /marketing-brand

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong marketing-brand $ARGUMENTS
```

## Source Command

# /marketing:marketing-brand — Brand Strategy

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── brand-positioning       → positioning.md
  ├── voice-guidelines        → voice.md
  ├── visual-identity         → visual-guide.md
  └── messaging-framework     → messaging.md
```

## Output directory: reports/marketing/marketing-brand/
