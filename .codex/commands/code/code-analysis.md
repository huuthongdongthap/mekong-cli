---
codex-command: "/code/code-analysis"
source: ".claude/commands/code/code-analysis.md"
invocation: "mekong code/code-analysis $ARGUMENTS"
description: "Deep code analysis with knowledge graph generation"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "cb1668fc099a9e2d7c107bef0d9d9ac5e7a8f700bd35a4afd7b1b004eb875220"
---

# /code/code-analysis

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong code/code-analysis $ARGUMENTS
```

## Source Command

// turbo

# /code-analysis - Deep Code Analyzer

Advanced code analysis with dependency graph and knowledge extraction.

## Usage

```
/code-analysis [path]
/code-analysis --graph
/code-analysis --optimize
```

## Claude Prompt Template

```
Deep code analysis workflow:

1. Build Knowledge Graph:
   - Map all imports/exports
   - Identify dependency chains
   - Find circular dependencies
   - Calculate coupling metrics

2. Generate Insights:
   - Hot paths (most called functions)
   - Dead code detection
   - Complexity hotspots
   - Refactoring opportunities

3. Create Visualization:
   - Mermaid diagram of dependencies
   - Module hierarchy
   - Call graph

4. Recommendations:
   - Architecture improvements
   - Performance optimizations
   - Maintainability enhancements

Save report to: .claude/reports/code-analysis.md
```

## Example Output

```
🧠 Deep Analysis: src/

📊 Knowledge Graph Generated
   - 45 modules mapped
   - 3 circular dependencies found
   - 12 dead code blocks identified

🔥 Hotspots:
   1. src/api/handlers.ts (complexity: 28)
   2. src/utils/parser.ts (complexity: 22)

💡 Recommendations:
   1. Split handlers.ts into smaller modules
   2. Remove 12 unused exports
   3. Consider memoization in parser.ts

📁 Full report: .claude/reports/code-analysis.md
```
