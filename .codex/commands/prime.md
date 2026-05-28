---
codex-command: "/prime"
source: ".claude/commands/prime.md"
invocation: "mekong prime $ARGUMENTS"
description: "Quick prime — load essential project context (CLAUDE.md + package.json + dir tree) in under 5 seconds"
argument-hint: "[--minimal]"
allowed-tools: "Bash, Read"
content-sha256: "c90da8df46a7a4edb4c95c3adda18f3bb09df55569eecc59a4044cb39bfaf644"
---

# /prime

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong prime $ARGUMENTS
```

## Source Command

# /prime — Quick Context Prime

Load context tối thiểu cho project hiện tại — chỉ những gì cần thiết nhất để bắt đầu làm việc.

## Usage
```
/prime                  # Quick prime — load CLAUDE.md + package.json + top-level dirs
/prime --minimal        # Ultra-minimal — chỉ CLAUDE.md
```

## Implementation

1. **Read CLAUDE.md/project config** — execution rules + project type
2. **Read package.json** — dependencies + scripts (if exists)  
3. **List top-level dirs** — structure overview
4. **Confirm context loaded** — brief status

## Output (minimal)
```
✓ Context loaded: <project>
  Type: <node/python/etc>
  Deps: <count>
  Commands: available via /command-name
```
