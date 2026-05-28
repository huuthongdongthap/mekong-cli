---
codex-command: "/daily"
source: ".claude/commands/daily.md"
invocation: "mekong daily $ARGUMENTS"
description: "Get daily status report from Agentic Overlord"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "734f842aed794e6db34bfabbfaff1de6ee315098b17926f2fba2359bba927e6a"
---

# /daily

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong daily $ARGUMENTS
```

## Source Command

# /daily Command

Quick daily summary of agent activity and pending decisions.

## Usage

```bash
/daily
```

## Output

The Agentic Overlord will provide:

1. **Revenue Summary**
    - Yesterday's revenue
    - Weekly trend
    - Top products

2. **Pending Approvals**
    - Draft tweets awaiting approval
    - Support replies needing review
    - Deployment queued

3. **Agent Health**
    - Active agents status
    - Any failures/warnings
    - Resource usage

4. **Today's Focus**
    - Recommended priorities
    - Blocked items

## Example Output

```
🏯 DAILY REPORT - Jan 17, 2026

💰 Revenue: $47 (↑12% WoW)
📝 Pending: 2 tweets, 1 support reply
⚙️ Agents: 4 active, 0 errors
🎯 Focus: Approve Twitter thread, review support ticket #123

Run /approve to action items.
```
