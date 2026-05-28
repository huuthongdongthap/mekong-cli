---
codex-command: "/studio-bootstrap"
source: ".claude/commands/studio-bootstrap.md"
invocation: "mekong studio-bootstrap $ARGUMENTS"
description: "Bootstrap venture studio — call mekong CLI engine. 1 command, ~15 min."
argument-hint: "[studio-name]"
allowed-tools: "Bash"
content-sha256: "d26783096212169bca39c54a782eedb114187bdee9e5ed23ef7300941dcd5b3b"
---

# /studio-bootstrap

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong studio-bootstrap $ARGUMENTS
```

## Source Command

# /studio:bootstrap — Bootstrap Venture Studio

**Merged to Mekong CLI Engine** — delegates to `mekong studio init` + `mekong venture thesis`.

## Execution

```bash
# Parse arguments
STUDIO_NAME="$1"

# Call mekong CLI engine - chained commands
mekong studio init "$STUDIO_NAME" && mekong venture thesis update
```

## Output

Delegates to mekong CLI — see CLI output.

## Engine Note

CRITICAL: Each sub-command MUST run via `mekong` CLI engine, NOT manual file operations.
Example: "portfolio-create" → `mekong portfolio create $ARGS`
