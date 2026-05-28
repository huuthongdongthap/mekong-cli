---
codex-command: "/context/prime"
source: ".claude/commands/context/prime.md"
invocation: "mekong context/prime $ARGUMENTS"
description: "Quick project prime - structure and key files"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "b6f4a1cd41e2f65d592fbf3656fe461d75a70df63ca63c2549ef45424e7ac692"
---

# /context/prime

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong context/prime $ARGUMENTS
```

## Source Command

// turbo

# /prime - Quick Context Prime

Fast project context loading for quick tasks.

## Usage

```
/prime
```

## Claude Prompt Template

```
Quick prime workflow:

1. View structure: tree -L 2 -I node_modules
2. Read key files:
   - README.md (first 100 lines)
   - CLAUDE.md or GEMINI.md
   - Main config file

3. Identify:
   - Project name
   - Main language
   - Entry point
   - Test command

Report summary.
```

## Example Output

```
⚡ Quick Prime: mekong-cli

📦 Type: Python monorepo
🚀 Entry: cli/main.py
🧪 Test: pytest tests/

Ready for work!
```
