---
codex-command: "/content-social"
source: ".claude/commands/content-social.md"
invocation: "mekong content-social $ARGUMENTS"
description: "Social media content — platform-specific posts, hashtags, scheduling. 3 steps, ~15 min."
argument-hint: "[topic or campaign]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "239804d48bad28bffb5db110d7628d5bfdb1df20d50592e9690350424635ce69"
---

# /content-social

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong content-social $ARGUMENTS
```

## Source Command

# /content:content-social — Social Media Content

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
PARALLEL:
  ├── twitter-posts           → twitter.md
  ├── linkedin-posts          → linkedin.md
  └── scheduling              → content-calendar.md
```

## Output directory: reports/content/content-social/
