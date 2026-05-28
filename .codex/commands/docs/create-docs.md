---
codex-command: "/docs/create-docs"
source: ".claude/commands/docs/create-docs.md"
invocation: "mekong docs/create-docs $ARGUMENTS"
description: "Generate comprehensive documentation for code"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "2b2f0935da9779c1b925e4a0191266695c9b56f93d49cfcc45da2b3a02cc4de1"
---

# /docs/create-docs

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong docs/create-docs $ARGUMENTS
```

## Source Command

// turbo

# /create-docs - Documentation Generator

Create comprehensive documentation for any code.

## Usage

```
/create-docs [path]
/create-docs --api
/create-docs --user
```

## Claude Prompt Template

```
Documentation workflow:

1. Analyze Code:
   - Parse all functions/classes
   - Extract docstrings
   - Map dependencies

2. Generate Documentation:

   ## API Reference
   - Function signatures
   - Parameters with types
   - Return values
   - Examples

   ## Usage Guide
   - Getting started
   - Common use cases
   - Best practices

   ## Architecture
   - Component overview
   - Data flow
   - Dependencies

3. Add Examples:
   - Code snippets
   - Expected output
   - Edge cases

Save to: docs/{module_name}.md
```

## Example Output

```
📝 Docs Created: src/payment/

Generated:
- docs/payment/api.md (42 functions)
- docs/payment/guide.md (usage)
- docs/payment/architecture.md

📊 Coverage: 94% documented
⚠️ Missing docs: 3 functions
```
