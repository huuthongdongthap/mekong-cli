---
description: "Quick prime — load essential project context (CLAUDE.md + package.json + dir tree) in under 5 seconds"
argument-hint: [--minimal]
allowed-tools: Bash, Read
---

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
