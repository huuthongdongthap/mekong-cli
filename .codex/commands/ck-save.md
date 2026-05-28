---
codex-command: "/ck-save"
source: ".claude/commands/ck-save.md"
invocation: "mekong ck-save $ARGUMENTS"
description: "Write an overview and save with claude-mem"
argument-hint: "$ARGUMENTS"
allowed-tools: "Bash"
content-sha256: "e8fa952b768d73ea9244a31121af7bd76e80c5a01e694080612065630c76e98d"
---

# /ck-save

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong ck-save $ARGUMENTS
```

## Source Command

**Write an overview** of the current conversation context and:
1. **Add it to claude-mem** using the chroma MCP tools. Always use primitive types (strings, numbers, booleans) when calling MCP Chroma tools directly. Arrays should be comma-separated strings, and nested objects should be flattened.
2. **Save the overview to index** using the claude-mem CLI tool: `claude-mem save "your overview message"`
