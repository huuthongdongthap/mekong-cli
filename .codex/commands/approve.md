---
codex-command: "/approve"
source: ".claude/commands/approve.md"
invocation: "mekong approve $ARGUMENTS"
description: "Approve pending content, decisions, or deployments"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "1a675e48c3b2491842ae8f0ef78d11142a93b6a9804aa9361033927a6e6fb0a8"
---

# /approve

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong approve $ARGUMENTS
```

## Source Command

# /approve Command

Approve items queued by agents during the "Overlord Shift".

## Usage

```bash
/approve              # List pending items
/approve all          # Approve all pending
/approve tweet        # Approve pending tweets
/approve support      # Approve support replies
/approve deploy       # Approve deployments
```

## Workflow

1. Agents queue items throughout the day
2. User runs `/daily` to see pending list
3. User runs `/approve [type]` to action

## Safety

- Tweets: Preview shown before posting
- Support: Email draft shown for review
- Deploy: Diff shown before push

## No-Disturbance Mode

If outside "Overlord Shift" (09:00-11:00), the command will warn:

```
⚠️ Current time: 17:30 (Family Time)
Items queued for tomorrow's shift.
Run /override to force approve.
```
