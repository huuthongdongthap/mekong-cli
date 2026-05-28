---
codex-command: "/worker-code"
source: ".claude/commands/worker-code.md"
invocation: "mekong worker-code $ARGUMENTS"
description: "Write code for a specific task — focused single-file implementation"
argument-hint: "[file-path] [task]"
allowed-tools: "default"
content-sha256: "26e571c23665c4925d10922753d0a930f8610495a7f329fdb26366257495badb"
---

# /worker-code

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong worker-code $ARGUMENTS
```

## Source Command

# /worker-code — Worker Operation

Implement code changes for ONE specific task.

1. Read the target file
2. Implement the change
3. Run syntax check
4. Run relevant tests
