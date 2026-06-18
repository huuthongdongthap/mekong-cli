#!/usr/bin/env python3
"""
Mekong MCP Server — Exposes Mekong CLI commands as MCP tools for Hermes.

This server bridges between Model Context Protocol (MCP) clients (like Hermes)
and the Mekong CLI command system, allowing AI assistants to execute any of
the 500+ Mekong commands as tools.

Usage:
    python -m mekong.mcp_server

Environment Variables:
    MEKONG_HOME: Path to mekong-cli root (default: ~/mekong-cli)
    HERMES_HOME: Path to Hermes home (default: ~/.hermes)
"""

import os
import re
import subprocess
import sys
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional

try:
    from mcp.server import Server
    from mcp.types import Tool, TextContent
except ImportError:
    print("Error: MCP SDK not installed. Run: pip install mcp", file=sys.stderr)
    sys.exit(1)

# Configuration (read dynamically from environment)
# Cache for command registry
COMMAND_REGISTRY: Dict[str, Dict[str, Any]] = {}
COMMAND_LOADED = False


def parse_command_metadata(md_path: Path) -> Optional[Dict[str, Any]]:
    """Parse command metadata from a markdown file.

    Expected frontmatter format:
        ---
        description: <text>
        argument-hint: "<text>"
        ---

    Returns dict with name, description, argument_hint, or None if invalid.
    """
    try:
        content = md_path.read_text(encoding='utf-8')
    except Exception:
        return None

    # Extract frontmatter
    match = re.search(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if not match:
        return None

    frontmatter = match.group(1)
    meta: Dict[str, Any] = {'name': md_path.stem}

    for line in frontmatter.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()
            if key == 'description':
                meta['description'] = value.strip('"\'')
            elif key == 'argument-hint':
                # Remove quotes if present
                meta['argument_hint'] = value.strip('"\'')
            elif key == 'mode' and value in ['fast', 'standard', 'hard']:
                meta['mode'] = value

    # Default description if missing
    if 'description' not in meta:
        meta['description'] = f"Execute Mekong command: {md_path.stem}"

    return meta


def load_all_commands() -> None:
    """Load all command definitions from commands directory."""
    global COMMAND_REGISTRY, COMMAND_LOADED
    if COMMAND_LOADED:
        return

    # Clear existing registry in-place to preserve object identity for importers
    COMMAND_REGISTRY.clear()

    # Compute commands directory from current HERMES_HOME
    hermes_home = Path(os.getenv("HERMES_HOME", "~/.hermes")).expanduser()
    commands_dir = hermes_home / ".claude" / "commands"

    if not commands_dir.exists():
        # Fall back to MEKONG_HOME/.claude/commands
        mekong_home_fallback = Path(os.getenv("MEKONG_HOME", "~/mekong-cli")).expanduser()
        fallback = mekong_home_fallback / ".claude" / "commands"
        if fallback.exists():
            commands_dir = fallback

    if not commands_dir.exists():
        # Minimal registry with core commands
        COMMAND_REGISTRY.update({
            'plan': {
                'name': 'plan',
                'description': 'Create implementation plan with research and analysis',
                'argument_hint': '<task description>'
            },
            'cook': {
                'name': 'cook',
                'description': 'Execute multi-step DAG recipe from recipes/ directory',
                'argument_hint': '<recipe-name> [args...]'
            },
            'test': {
                'name': 'test',
                'description': 'Generate unit, integration, and edge case tests',
                'argument_hint': '<test-spec>'
            },
        })
        COMMAND_LOADED = True
        return

    # Load all .md files
    md_files = list(commands_dir.glob("*.md"))
    for md_file in md_files:
        meta = parse_command_metadata(md_file)
        if meta:
            COMMAND_REGISTRY[meta['name']] = meta

    # Load namespaced commands from subdirectories
    for subdir in commands_dir.iterdir():
        if subdir.is_dir():
            for md_file in subdir.glob("*.md"):
                meta = parse_command_metadata(md_file)
                if meta:
                    # Namespaced name: subdir_name.command_name
                    ns_name = f"{subdir.name}.{meta['name']}"
                    meta['name'] = ns_name
                    meta['namespaced'] = True
                    COMMAND_REGISTRY[ns_name] = meta

    COMMAND_LOADED = True


async def list_tools() -> List[Tool]:
    """MCP list_tools handler — returns all available Mekong commands."""
    load_all_commands()

    tools = []
    for name, meta in COMMAND_REGISTRY.items():
        # Build input schema
        schema = {
            "type": "object",
            "properties": {
                "arguments": {
                    "type": "string",
                    "description": meta.get('argument_hint', 'Command arguments and options')
                },
                "mode": {
                    "type": "string",
                    "enum": ["fast", "standard", "hard"],
                    "default": "standard",
                    "description": "Execution mode: fast (quick), standard (balanced), hard (thorough)"
                },
                "timeout": {
                    "type": "number",
                    "default": 300,
                    "minimum": 30,
                    "maximum": 1800,
                    "description": "Timeout in seconds (30-1800)"
                }
            },
            "required": ["arguments"]
        }

        # Add mode enum if command supports it (most do)
        tools.append(Tool(
            name=f"mekong_{name}",
            description=meta['description'],
            inputSchema=schema
        ))

    return tools


async def call_tool(name: str, arguments: dict) -> List[TextContent]:
    """MCP call_tool handler — executes a Mekong command."""
    load_all_commands()

    cmd_name = name.replace("mekong_", "")

    if cmd_name not in COMMAND_REGISTRY:
        return [TextContent(
            type="text",
            text=f"❌ Error: Unknown command '{cmd_name}'\n\n"
                 f"Use 'mekong --help' to see available commands."
        )]

    # Prepare environment - use runtime values
    env = os.environ.copy()
    hermes_home = Path(os.getenv("HERMES_HOME", "~/.hermes")).expanduser()
    mekong_home = Path(os.getenv("MEKONG_HOME", "~/mekong-cli")).expanduser()
    env["HERMES_HOME"] = str(hermes_home)
    env["MEKONG_HOME"] = str(mekong_home)
    env["CLAUDE_HOME"] = str(hermes_home)
    env["ANSICON"] = "1"  # Windows color support

    # Build command
    mode = arguments.get('mode', 'standard')
    cmd_args = arguments.get('arguments', '')
    timeout = arguments.get('timeout', 300)

    # Construct full command
    # Check if namespaced
    if '.' in cmd_name:
        # Namespaced: subdir.cmd
        subdir, base_cmd = cmd_name.split('.', 1)
        cmd_parts = ["mekong", subdir, base_cmd]
    else:
        cmd_parts = ["mekong", cmd_name]

    # Add mode if not default
    if mode != 'standard':
        cmd_parts.append(f"--{mode}")

    # Add arguments
    if cmd_args:
        cmd_parts.append(cmd_args)

    # Execute
    # Resolve MEKONG_HOME at runtime
    mekong_home = Path(os.getenv("MEKONG_HOME", "~/mekong-cli")).expanduser()
    try:
        result = subprocess.run(
            cmd_parts,
            capture_output=True,
            text=True,
            timeout=timeout,
            env=env,
            cwd=str(mekong_home)
        )
    except subprocess.TimeoutExpired:
        return [TextContent(
            type="text",
            text=f"⏱️  Command timed out after {timeout}s\n\n"
                 f"Consider using --fast mode or reducing task scope."
        )]
    except Exception as e:
        return [TextContent(
            type="text",
            text=f"❌ Execution error:\n{type(e).__name__}: {e}"
        )]

    # Format output
    output_parts = []

    if result.stdout:
        output_parts.append("📤 Output:\n")
        output_parts.append(result.stdout)

    if result.stderr:
        # Only show stderr if command failed
        if result.returncode != 0:
            output_parts.append("\n❌ Error output:\n")
            output_parts.append(result.stderr)
        else:
            # Non-fatal warnings might be in stderr
            if result.stderr.strip():
                output_parts.append("\n⚠️  Warnings:\n")
                output_parts.append(result.stderr)

    if result.returncode != 0:
        output_parts.append(f"\n🔢 Exit code: {result.returncode}")

    return [TextContent(type="text", text="".join(output_parts))]


async def main():
    """Main entry point for MCP server."""
    import anyio

    # Create MCP server
    server = Server("mekong-commands")

    @server.list_tools()
    async def handle_list_tools() -> List[Tool]:
        """List all available Mekong commands as MCP tools."""
        return await list_tools()

    @server.call_tool()
    async def handle_call_tool(name: str, arguments: dict) -> List[TextContent]:
        """Execute a Mekong command."""
        return await call_tool(name, arguments)

    # Run server over stdio
    async with anyio.stdio.fd_reader(0) as stdin, anyio.stdio.fd_writer(1) as stdout:
        await server.run(
            stdin.receive_until_eof(),
            stdout.send_all,
            server.create_initialization_options()
        )


if __name__ == "__main__":
    # Run the server
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nMekong MCP Server stopped", file=sys.stderr)
        sys.exit(0)
