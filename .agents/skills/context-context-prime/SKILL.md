---
name: context-context-prime
description: "Prime Claude with comprehensive project understanding"
---

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
