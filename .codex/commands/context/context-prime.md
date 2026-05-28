---
codex-command: "/context/context-prime"
source: ".claude/commands/context/context-prime.md"
invocation: "mekong context/context-prime $ARGUMENTS"
description: "Prime Claude with comprehensive project understanding"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "e13952b64f42bf6cc8d95e5a8ccc1ff9faaebca268b84142d3f8a636a523557b"
---

# /context/context-prime

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong context/context-prime $ARGUMENTS
```

## Source Command

// turbo

# /context-prime - Project Context Loader

Load full project context for better Claude understanding.

## Usage

```
/context-prime
```

## Claude Prompt Template

```
Context priming workflow:

1. Load Project Structure:
   - Read directory tree (max 3 levels)
   - Identify key directories
   - Map project type (Python/Node/etc)

2. Load Key Files:
   - README.md
   - CLAUDE.md / GEMINI.md
   - package.json / pyproject.toml
   - .env.example

3. Analyze Architecture:
   - Entry points
   - Main modules
   - Test structure
   - Config files

4. Establish Context:
   - Project goals
   - Coding standards
   - Team conventions
   - Key dependencies

5. Set Session Parameters:
   - Preferred language
   - Code style
   - Testing framework
   - Build tools

Report context loaded.
```

## Example Output

```
🧠 Context Prime: mekong-cli

📁 Project Type: Python + Node monorepo
📦 Key Deps: FastAPI, React, Turbo

📂 Structure Loaded:
   - 45 Python modules
   - 23 React components
   - 168 test files

📋 Standards Detected:
   - Ruff for Python linting
   - ESLint for TypeScript
   - Conventional commits

✅ Context loaded! Claude is ready.
```
