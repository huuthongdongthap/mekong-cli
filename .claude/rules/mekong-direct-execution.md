# Mekong CLI Direct Execution Rules - MANDATORY GLOBAL RULES

This rule governs how the AI Agent (Antigravity, Claude Code CLI, etc.) intercepts and executes Mekong CLI commands directly from the chat window.

## 🔴 INTERCEPTION TRIGGER

You MUST intercept the user input and immediately run it as a terminal command if the input matches any of the following patterns:

1. **Starts with a slash (`/`)**: E.g., `/cto-review`, `/bhxh`, `/ke-toan-vn --help`.
   *(Note: This excludes registered system slash commands like `/goal`, `/schedule`, `/grill-me`, `/teamwork-preview` which are intercepted by the client before reaching the LLM).*
2. **Starts with `mekong ` or `mek `**: E.g., `mekong version`, `mek status`.
3. **Is a known Mekong CLI command**: E.g., `bhxh`, `ke-toan-vn`, `cto-health` typed directly.

---

## 🔴 EXECUTION ENGINE

When triggered, you MUST bypass any conversational response, greeting, or explanation. You MUST instantly invoke the `run_command` tool using the following exact configuration:

### Terminal Execution Template
```bash
bash -c "source /Users/mac/mekong-cli/.venv/bin/activate && /Users/mac/mekong-cli/scripts/mekong-wrapper.sh <command_with_arguments>"
```

### Argument Formatting
* If the user input starts with `/`, strip the leading `/` (e.g., `/cto-review --all` becomes `cto-review --all`).
* If the user input starts with `mekong ` or `mek `, pass the full command (e.g., `mekong version` becomes `version`).

### Sandbox Rules
* **Bypass Sandbox (`BypassSandbox: true`)**: You MUST set `BypassSandbox: true` for commands that read outside the workspace (e.g. `commands-status` which reads `/tmp/factory-metrics.log`) or commands requiring network/git operations.
* **Standard Sandbox**: For pure local or dry-run operations, use standard sandbox mode to execute silently and automatically.

---

## 🔴 RESPONSE FORMAT

Do NOT write any conversational text (e.g., "Certainly!", "Running..."). Only output:
1. The exact command running.
2. The raw stdout/stderr inside a standard Markdown code block (fenced with ```).
3. The exit code or execution status.
