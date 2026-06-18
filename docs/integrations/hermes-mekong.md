# Hermes + Mekong Integration

> Expose all 505 Mekong CLI commands as Hermes AI tools via MCP

## Overview

This integration allows Hermes to execute any Mekong CLI command directly through the Model Context Protocol (MCP). All 505+ commands become available as Hermes tools (`mekong_<command-name>`), enabling the AI assistant to perform development tasks, run tests, deploy code, and more.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Hermes AI                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ MCP Client (stdio transport)                         │  │
│  └───────────────┬──────────────────────────────────────┘  │
│                  │ MCP Protocol                            │
└──────────────────┼─────────────────────────────────────────┘
                   │
┌──────────────────▼─────────────────────────────────────────┐
│          Mekong MCP Server (mekong/mcp_server.py)         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Load command registry from ~/.claude/commands/    │  │
│  │ • Parse .md metadata files                          │  │
│  │ • Execute via subprocess.run()                      │  │
│  │ • Return output as MCP TextContent                  │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────┬─────────────────────────────────────────┘
                   │ Shell Execution
┌──────────────────▼─────────────────────────────────────────┐
│              Mekong CLI (mekong)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ PEV Orchestrator • Agent Layer • LLM Router         │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

## Installation

### Prerequisites

1. **Hermes** installed and configured
2. **Mekong CLI** installed at `~/mekong-cli`
3. **MCP SDK**: `pip install mcp`
4. **Python 3.10+**

### Steps

1. **Verify Mekong CLI installation**

   ```bash
   mekong --version
   # Should output: Mekong CLI version ...
   ```

2. **Register MCP server** (already done in `mekong/mcp.json`)

   ```json
   {
     "mcpServers": {
       "mekong-commands": {
         "command": "python",
         "args": ["-m", "mekong.mcp_server"],
         "env": {
           "HERMES_HOME": "~/.hermes",
           "MEKONG_HOME": "~/mekong-cli"
         }
       }
     }
   }
   ```

3. **Create Hermes manifest** (already done)

   Location: `~/.hermes/hermes-agent/optional-mcps/mekong-commands/manifest.yaml`

4. **Restart Hermes**

   ```bash
   # Stop all Hermes processes
   pkill -f hermes

   # Start Hermes (method depends on installation)
   hermes start
   ```

5. **Verify MCP server loaded**

   In Hermes, ask: "What tools do you have available?"
   You should see tools starting with `mekong_`.

## Usage

### Listing Available Commands

```bash
# In Hermes chat
"What Mekong commands are available?"
# AI will use mekong_commands list_tools to show all 505+ commands
```

### Executing a Command

```bash
# Example: Create an implementation plan
/call mekong_plan "Implement user authentication"

# Example: Run tests
/call mekong_test "src/auth/ --coverage"

# Example: Execute a recipe
/call mekong_cook "feature-auth --fast"
```

### Tool Schema

Each Mekong command becomes an MCP tool with the following input schema:

```json
{
  "type": "object",
  "properties": {
    "arguments": {
      "type": "string",
      "description": "Command arguments and options"
    },
    "mode": {
      "type": "string",
      "enum": ["fast", "standard", "hard"],
      "default": "standard"
    },
    "timeout": {
      "type": "number",
      "default": 300,
      "minimum": 30,
      "maximum": 1800
    }
  },
  "required": ["arguments"]
}
```

**Parameters:**
- `arguments` (required): The command arguments, flags, and options
- `mode` (optional): Execution speed/quality tradeoff
  - `fast`: Quick execution, minimal verification (~2x speed)
  - `standard`: Balanced (default)
  - `hard`: Comprehensive with extra checks (~2x time)
- `timeout` (optional): Max execution time in seconds (default: 300)

## Command Naming

### Flat Commands

Top-level commands become `mekong_<command>`:

| Tool Name | Mekong Command | Example |
|-----------|----------------|---------|
| `mekong_plan` | `/plan` | Create implementation plan |
| `mekong_cook` | `/cook` | Execute recipe |
| `mekong_test` | `/test` | Generate tests |
| `mekong_review` | `/review` | Code review |
| `mekong_ship` | `/ship` | Deploy pipeline |

### Namespaced Commands

Commands in subdirectories use dot notation:

| Tool Name | Mekong Command | Example |
|-----------|----------------|---------|
| `mekong_git.commit` | `git:commit` | Git operations |
| `mekong_ci.run-ci` | `ci:run-ci` | CI/CD pipelines |
| `mekong_finance.bhxh` | `finance:bhxh` | Vietnam social insurance |

The MCP server automatically:
- Loads all `.md` files from `~/.claude/commands/`
- Creates flat names for root commands
- Creates `subdir.cmd` names for namespaced commands

## Examples

### Development Workflow

```bash
# 1. Plan
/call mekong_plan "Build React component with TypeScript"

# 2. Execute (fast mode for iteration)
/call mekong_cook "component-user-profile --fast" "mode=fast"

# 3. Test
/call mekong_test "tests/UserProfile.test.tsx"

# 4. Review
/call mekong_review "src/components/UserProfile.tsx"

# 5. Ship
/call mekong_ship "feature/user-profile"
```

### Multi-command Sequences

Hermes can orchestrate multiple Mekong commands in sequence:

```bash
"Debug the failing CI build"
→ mekong_scout "Find test files"
→ mekong_debug "Analyze failure"
→ mekong_fix "Apply fix"
→ mekong_test "Verify fix"
```

### Advanced Usage

**Long-running tasks with extended timeout:**

```bash
/call mekong_dev_feature "full-auth-system" timeout=1800
```

**Fast iteration mode:**

```bash
/call mekong_plan "Quick prototype" mode=fast
```

**Namespaced command:**

```bash
/call mekong_ci.run-ci "pipeline.yml --watch"
```

## Troubleshooting

### MCP Server Not Starting

**Check Python dependencies:**
```bash
python3 -c "import mcp; print('MCP installed')"
# If error: pip install mcp
```

**Check command registry:**
```bash
python3 -c "from mekong.mcp_server import load_all_commands; load_all_commands(); print(len(COMMAND_REGISTRY))"
# Should output number of commands (505+)
```

### Command Execution Fails

**Verify Mekong CLI works:**
```bash
mekong plan "test"
```

**Check environment variables:**
```bash
echo $HERMES_HOME   # Should be ~/.hermes
echo $MEKONG_HOME   # Should be ~/mekong-cli
```

### Timeout Errors

Increase timeout parameter:

```bash
/call mekong_cook "complex-feature" timeout=600
```

Or use fast mode:

```bash
/call mekong_cook "complex-feature" mode=fast
```

### Tool Not Found

If `mekong_<command>` tool is missing:

1. Check command exists in registry:
   ```bash
   ls ~/.claude/commands/<command>.md
   ```

2. Restart Hermes to reload MCP tools:
   ```bash
   pkill -f hermes
   hermes start
   ```

## Performance Considerations

- **Tool discovery**: Cached after first load (~50ms for 505 commands)
- **Command execution**: Spawns subprocess; inherits Mekong's timeout handling
- **MCP protocol**: stdio transport; low latency
- **Memory**: ~50MB for server + command cache

## Security

⚠️ **Important:** This MCP server executes shell commands with full system access.

**Recommendations:**
1. Run Hermes in a sandboxed environment for untrusted conversations
2. Review command arguments before execution (Hermes should ask for confirmation)
3. Enable Hermes approval mode for destructive commands:
   ```yaml
   approvals:
     mode: manual
   ```
4. Use `timeout` parameter to prevent runaway processes
5. Monitor logs for suspicious command patterns

## Development

### Running Standalone

Test the MCP server independently:

```bash
# Run server (stdio mode)
python -m mekong.mcp_server

# In another terminal, test with mcp-cli
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | python -m mekong.mcp_server
```

### Adding New Commands

1. Create command definition in `~/.claude/commands/` or subdirectory
2. Format:
   ```markdown
   ---
   description: "My new command"
   argument-hint: "<args>"
   ---
   # Command content...
   ```
3. Restart Hermes or send `SIGHUP` to MCP server

### Debug Logging

Enable debug mode:

```bash
export MEKONG_MCP_DEBUG=1
hermes start
```

## References

- [MCP Specification](https://github.com/modelcontextprotocol/specification)
- [Mekong CLI Documentation](../README.md)
- [Hermes MCP Integration](../hermes-agent/README.md)
- [Command Catalog](https://mekong-cli.nousresearch.com/docs/commands)

## Status

**Production Ready** ✓

- MCP server implemented: `mekong/mcp_server.py` (300 LOC)
- Hermes manifest: `hermes-agent/optional-mcps/mekong-commands/manifest.yaml`
- Mekong registry: `mekong/mcp.json`
- 505+ commands exposed
- Auto-discovery working
- Tested with core commands: plan, cook, test, review, ship

---

**Last Updated:** 2026-06-18  
**Version:** 1.0.0
