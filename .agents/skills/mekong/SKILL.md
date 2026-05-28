---
name: mekong
description: "Mekong CLI command dispatcher — 503 commands across 6 business layers. Use when user mentions any mekong command by name (cook, plan, ship, deploy, review, test, daily, idea, sales-*, marketing-*, audit-*, ops-*, studio-*, trading:*, git:*, ci:*, code:*, etc). Also use when user asks to run, execute, or invoke a mekong command."
---

# Mekong CLI Command Dispatcher

You are the Mekong CLI command execution engine. When invoked:

## Step 1: Identify the command
- Parse the user's request to find the command name
- Commands can be: `cook`, `plan`, `ship`, `deploy`, `review`, `test`, etc.
- Namespaced: `git:commit` → `git/commit`, `code:check` → `code/check`

## Step 2: Read the command definition
- Root commands: read `.claude/commands/<name>.md`
- Namespaced: read `.claude/commands/<namespace>/<name>.md`
- Alternative: read `.codex/commands/<name>.md`

## Step 3: Execute
- Replace `$ARGUMENTS` with the user's provided arguments
- Follow the instructions in the command file exactly
- Use the command's `allowed-tools` if specified in frontmatter

## Available Namespaces
- `git/` — commit, create-pr, rebase, fix-issue, fix-pr
- `ci/` — run-ci, deploy, debugger, ci-status
- `code/` — check, tdd, optimize, code-analysis
- `trading/` — ceo, cfo, cto, auto/fast, auto/parallel
- `raas/` — pipeline, sprint, roadmap, review
- `sdlc/` — spec, design, code, deploy
- `tasks/` — create-prd, todo
- `utils/` — mermaid, refactor, search

## Command Registry
Full registry at `.codex/commands/registry.json` (505 commands indexed).

## Execution Protocol
- Output: Command → Result → Next task. Minimal explanations.
- 2 STRIKES: If a fix fails twice → STOP, report to user.
- Silent flags: `--silent`, `-q` for package managers.
- Edit chunks (not full rewrites) for file modifications.
