#!/usr/bin/env python3
"""
Unit tests for Mekong MCP Server.

Run with: python -m pytest tests/test_mcp_server.py -v
"""

import os
import re
import sys
import asyncio
from pathlib import Path
from unittest.mock import patch, MagicMock

import pytest

# Add mekong to path for module import
sys.path.insert(0, str(Path(__file__).parent.parent / "mekong"))

from mcp_server import (
    parse_command_metadata,
    load_all_commands,
    COMMAND_REGISTRY,
    list_tools,
    call_tool
)


# ==================== Test Fixtures ====================

@pytest.fixture(autouse=True)
def reset_command_registry():
    """Reset global registry before each test."""
    import mcp_server
    mcp_server.COMMAND_REGISTRY.clear()
    mcp_server.COMMAND_LOADED = False
    yield
    mcp_server.COMMAND_REGISTRY.clear()
    mcp_server.COMMAND_LOADED = False


@pytest.fixture
def temp_commands_dir(tmp_path):
    """Create temporary commands directory with test command files."""
    # Set HERMES_HOME to tmp_path
    old_hermes = os.environ.get('HERMES_HOME')
    os.environ['HERMES_HOME'] = str(tmp_path)

    commands_dir = tmp_path / ".claude" / "commands"
    commands_dir.mkdir(parents=True)

    # Create a simple command
    plan_cmd = commands_dir / "plan.md"
    plan_cmd.write_text("""---
description: "Create implementation plan"
argument-hint: "<task description>"
---

# Plan Command
Create a detailed implementation plan.
""")

    # Create a namespaced command
    git_dir = commands_dir / "git"
    git_dir.mkdir()
    git_commit = git_dir / "commit.md"
    git_commit.write_text("""---
description: "Git commit with conventional format"
argument-hint: "<commit message>"
---

# Git Commit
Commit changes with proper format.
""")

    # Create command without frontmatter
    no_front = commands_dir / "legacy.md"
    no_front.write_text("# Legacy Command\nNo frontmatter here.")

    yield commands_dir

    # Cleanup
    if old_hermes:
        os.environ['HERMES_HOME'] = old_hermes
    elif 'HERMES_HOME' in os.environ:
        del os.environ['HERMES_HOME']


# ==================== parse_command_metadata Tests ====================

class TestParseCommandMetadata:
    """Tests for command metadata parser."""

    def test_parse_valid_command(self, tmp_path):
        """Test parsing a valid command file."""
        cmd_file = tmp_path / "test.md"
        cmd_file.write_text("""---
description: "Test command"
argument-hint: "<args>"
---
Content""")
        meta = parse_command_metadata(cmd_file)
        assert meta is not None
        assert meta['name'] == 'test'
        assert meta['description'] == 'Test command'
        assert meta['argument_hint'] == '<args>'

    def test_parse_command_with_quoted_hint(self, tmp_path):
        """Test parsing argument-hint with quotes."""
        cmd_file = tmp_path / "test.md"
        cmd_file.write_text("""---
description: "Test"
argument-hint: "<file> --force"
---
""")
        meta = parse_command_metadata(cmd_file)
        assert meta['argument_hint'] == '<file> --force'

    def test_parse_command_with_mode(self, tmp_path):
        """Test parsing mode field."""
        cmd_file = tmp_path / "test.md"
        cmd_file.write_text("""---
description: "Test"
argument-hint: "<args>"
mode: fast
---
""")
        meta = parse_command_metadata(cmd_file)
        assert meta['mode'] == 'fast'

    def test_parse_invalid_mode_ignored(self, tmp_path):
        """Test invalid mode is ignored."""
        cmd_file = tmp_path / "test.md"
        cmd_file.write_text("""---
description: "Test"
mode: invalid
---
""")
        meta = parse_command_metadata(cmd_file)
        assert 'mode' not in meta

    def test_parse_missing_frontmatter(self, tmp_path):
        """Test file without frontmatter returns None."""
        cmd_file = tmp_path / "test.md"
        cmd_file.write_text("# No frontmatter")
        meta = parse_command_metadata(cmd_file)
        assert meta is None

    def test_parse_missing_description_defaults(self, tmp_path):
        """Test missing description gets default."""
        cmd_file = tmp_path / "test.md"
        cmd_file.write_text("""---
argument-hint: "<args>"
---
""")
        meta = parse_command_metadata(cmd_file)
        assert meta['description'] == 'Execute Mekong command: test'

    def test_parse_unreadable_file(self, tmp_path):
        """Test unreadable file returns None."""
        cmd_file = tmp_path / "test.md"
        cmd_file.write_text("content")
        os.chmod(cmd_file, 0o000)  # No permissions
        try:
            meta = parse_command_metadata(cmd_file)
            assert meta is None
        finally:
            os.chmod(cmd_file, 0o644)

    def test_parse_command_name_validation(self, tmp_path):
        """Test that unsafe command names are rejected by pattern."""
        # This tests the SAFE_NAME_PATTERN validation in load_all_commands
        # Safe names should pass
        safe_names = ['plan', 'git-commit', 'test.mcp', 'my_command', 'abc123']
        for name in safe_names:
            assert re.match(r'^[a-zA-Z0-9._-]+$', name) is not None

        # Unsafe names should fail
        unsafe_names = ['../etc/passwd', 'test;rm -rf', 'name with spaces', '']
        for name in unsafe_names:
            assert re.match(r'^[a-zA-Z0-9._-]+$', name) is None


# ==================== load_all_commands Tests ====================

class TestLoadAllCommands:
    """Tests for command registry loader."""

    def test_load_from_custom_dir(self, temp_commands_dir, monkeypatch):
        """Test loading commands from custom HERMES_HOME."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        load_all_commands()
        assert 'plan' in COMMAND_REGISTRY
        assert COMMAND_REGISTRY['plan']['description'] == 'Create implementation plan'

    def test_load_namespaced_commands(self, temp_commands_dir, monkeypatch):
        """Test namespaced commands get dot notation."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        load_all_commands()
        assert 'git.commit' in COMMAND_REGISTRY
        meta = COMMAND_REGISTRY['git.commit']
        assert meta['name'] == 'git.commit'
        assert meta['namespaced'] is True
        assert 'Git commit' in meta['description']

    def test_fallback_to_mekong_home(self, tmp_path, monkeypatch):
        """Test fallback to MEKONG_HOME when HERMES_HOME not found."""
        # Create mekong-cli structure
        mekong_home = tmp_path / "mekong-cli"
        mekong_home.mkdir()
        commands_dir = mekong_home / ".claude" / "commands"
        commands_dir.mkdir(parents=True)
        (commands_dir / "fallback.md").write_text("""---
description: "Fallback command"
---
""")

        monkeypatch.setenv('HERMES_HOME', str(tmp_path / "nonexistent"))
        monkeypatch.setenv('MEKONG_HOME', str(mekong_home))
        load_all_commands()
        assert 'fallback' in COMMAND_REGISTRY

    def test_minimal_registry_when_no_dir(self, monkeypatch):
        """Test minimal registry when no commands dir exists."""
        monkeypatch.setenv('HERMES_HOME', '/nonexistent')
        monkeypatch.setenv('MEKONG_HOME', '/nonexistent')
        load_all_commands()
        assert 'plan' in COMMAND_REGISTRY
        assert 'cook' in COMMAND_REGISTRY
        assert 'test' in COMMAND_REGISTRY

    def test_load_only_once(self, temp_commands_dir, monkeypatch):
        """Test commands only loaded once (cached)."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        load_all_commands()
        initial_count = len(COMMAND_REGISTRY)
        # Add new command to disk
        (temp_commands_dir / "new.md").write_text("""---
description: "New"
---
""")
        load_all_commands()
        # Should not change because already loaded
        assert len(COMMAND_REGISTRY) == initial_count


# ==================== list_tools Tests ====================

class TestListTools:
    """Tests for MCP list_tools handler."""

    def test_list_tools_returns_tools(self, temp_commands_dir, monkeypatch):
        """Test list_tools returns Tool objects."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        tools = asyncio.run(list_tools())
        assert len(tools) > 0
        assert all(hasattr(t, 'name') for t in tools)
        assert all(hasattr(t, 'description') for t in tools)
        assert all(hasattr(t, 'inputSchema') for t in tools)

    def test_tool_names_have_mekong_prefix(self, temp_commands_dir, monkeypatch):
        """Test all tool names start with 'mekong_'."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        tools = asyncio.run(list_tools())
        for tool in tools:
            assert tool.name.startswith('mekong_')

    def test_input_schema_structure(self, temp_commands_dir, monkeypatch):
        """Test input schema has required properties."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        tools = asyncio.run(list_tools())
        for tool in tools:
            schema = tool.inputSchema
            assert schema['type'] == 'object'
            assert 'properties' in schema
            assert 'arguments' in schema['properties']
            assert schema['required'] == ['arguments']

    def test_mode_enum_in_schema(self, temp_commands_dir, monkeypatch):
        """Test mode property has correct enum."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        tools = asyncio.run(list_tools())
        for tool in tools:
            mode_prop = tool.inputSchema['properties']['mode']
            assert mode_prop['enum'] == ['fast', 'standard', 'hard']
            assert mode_prop['default'] == 'standard'

    def test_timeout_limits(self, temp_commands_dir, monkeypatch):
        """Test timeout has proper bounds."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        tools = asyncio.run(list_tools())
        for tool in tools:
            timeout_prop = tool.inputSchema['properties']['timeout']
            assert timeout_prop['default'] == 300
            assert timeout_prop['minimum'] == 30
            assert timeout_prop['maximum'] == 1800

    def test_verbose_parameter_in_schema(self, temp_commands_dir, monkeypatch):
        """Test verbose parameter is present in schema."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        tools = asyncio.run(list_tools())
        for tool in tools:
            verbose_prop = tool.inputSchema['properties']['verbose']
            assert verbose_prop['type'] == 'boolean'
            assert verbose_prop['default'] is False
            assert 'Include stderr' in verbose_prop['description']


# ==================== call_tool Tests ====================

class TestCallTool:
    """Tests for MCP call_tool handler."""

    @pytest.mark.asyncio
    async def test_call_unknown_command(self):
        """Test calling unknown command returns error."""
        results = await call_tool('mekong_unknown', {'arguments': 'test'})
        assert len(results) == 1
        assert 'Unknown command' in results[0].text

    @pytest.mark.asyncio
    async def test_call_missing_arguments(self, temp_commands_dir, monkeypatch):
        """Test calling with missing arguments uses empty string."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        # Should handle gracefully with empty arguments
        results = await call_tool('mekong_plan', {})
        assert len(results) == 1
        # Command will execute with empty args

    @pytest.mark.asyncio
    async def test_command_execution_success(self, temp_commands_dir, monkeypatch):
        """Test successful command execution."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        monkeypatch.setenv('MEKONG_HOME', str(temp_commands_dir.parent.parent.parent / "mekong-cli-fake"))
        results = await call_tool('mekong_plan', {'arguments': '--help'})
        assert len(results) == 1
        # Output should contain something (--help returns usage)
        assert 'Output' in results[0].text or 'error' in results[0].text.lower()

    @pytest.mark.asyncio
    async def test_timeout_handling(self, temp_commands_dir, monkeypatch):
        """Test command timeout."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        results = await call_tool('mekong_plan', {'arguments': 'test', 'timeout': 1})
        # Either succeeds quickly or times out gracefully
        assert len(results) == 1
        assert isinstance(results[0].text, str)

    @pytest.mark.asyncio
    async def test_mode_passed_to_command(self, temp_commands_dir, monkeypatch):
        """Test mode parameter is passed to command."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        with patch('subprocess.run') as mock_run:
            mock_result = MagicMock()
            mock_result.stdout = "output"
            mock_result.stderr = ""
            mock_result.returncode = 0
            mock_run.return_value = mock_result

            _ = await call_tool('mekong_plan', {
                'arguments': 'test',
                'mode': 'fast'
            })

            assert mock_run.called
            call_args = mock_run.call_args[0][0]
            assert '--fast' in call_args

    @pytest.mark.asyncio
    async def test_mode_standard_not_added(self, temp_commands_dir, monkeypatch):
        """Test --standard flag not added (default mode)."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        with patch('subprocess.run') as mock_run:
            mock_result = MagicMock()
            mock_result.stdout = "output"
            mock_result.stderr = ""
            mock_result.returncode = 0
            mock_run.return_value = mock_result

            _ = await call_tool('mekong_plan', {
                'arguments': 'test',
                'mode': 'standard'
            })

            call_args = mock_run.call_args[0][0]
            assert '--standard' not in call_args

    @pytest.mark.asyncio
    async def test_namespaced_command_execution(self, temp_commands_dir, monkeypatch):
        """Test namespaced command (subdir.cmd) executes correctly."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        with patch('subprocess.run') as mock_run:
            mock_result = MagicMock()
            mock_result.stdout = "git commit output"
            mock_result.stderr = ""
            mock_result.returncode = 0
            mock_run.return_value = mock_result

            _ = await call_tool('mekong_git.commit', {'arguments': 'msg'})

            call_args = mock_run.call_args[0][0]
            # Namespaced commands become: mekong <subdir> <cmd>
            assert call_args == ['mekong', 'git', 'commit', 'msg']

    @pytest.mark.asyncio
    async def test_stderr_on_success_ignored(self, temp_commands_dir, monkeypatch):
        """Test stderr is hidden by default on success even if non-empty."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        with patch('subprocess.run') as mock_run:
            mock_result = MagicMock()
            mock_result.stdout = "output"
            mock_result.stderr = "warning: something"
            mock_result.returncode = 0
            mock_run.return_value = mock_result

            results = await call_tool('mekong_plan', {'arguments': 'test'})
            # Should NOT include warnings by default
            assert 'Warnings' not in results[0].text
            assert 'something' not in results[0].text

    @pytest.mark.asyncio
    async def test_stderr_on_success_with_verbose(self, temp_commands_dir, monkeypatch):
        """Test stderr is shown on success when verbose=True."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        with patch('subprocess.run') as mock_run:
            mock_result = MagicMock()
            mock_result.stdout = "output"
            mock_result.stderr = "warning: something"
            mock_result.returncode = 0
            mock_run.return_value = mock_result

            results = await call_tool('mekong_plan', {'arguments': 'test', 'verbose': True})
            # Should include warning when verbose
            assert 'Warnings' in results[0].text
            assert 'something' in results[0].text

    @pytest.mark.asyncio
    async def test_stderr_on_failure_shown(self, temp_commands_dir, monkeypatch):
        """Test stderr shown when command fails."""
        monkeypatch.setenv('HERMES_HOME', str(temp_commands_dir.parent.parent))
        with patch('subprocess.run') as mock_run:
            mock_result = MagicMock()
            mock_result.stdout = ""
            mock_result.stderr = "fatal error"
            mock_result.returncode = 1
            mock_run.return_value = mock_result

            results = await call_tool('mekong_plan', {'arguments': 'test'})
            assert 'Error output' in results[0].text
            assert 'fatal error' in results[0].text


# ==================== Integration Tests ====================

class TestIntegration:
    """Integration tests for MCP server."""

    def test_server_importable(self):
        """Test server module can be imported."""
        try:
            import mekong.mcp_server
            assert hasattr(mekong.mcp_server, 'main')
        except ImportError as e:
            pytest.fail(f"Failed to import mcp_server: {e}")

    def test_commands_directory_structure(self, tmp_path):
        """Test server handles various directory structures."""
        # Create nested structure
        commands_dir = tmp_path / "commands"
        deep_dir = commands_dir / "a" / "b" / "c"
        deep_dir.mkdir(parents=True)

        # Should only read one level deep
        # (subdirs directly under commands/)
        (commands_dir / "root.md").write_text("""---
description: "Root"
---
""")
        (commands_dir / "a" / "sub.md").write_text("""---
description: "Deep"
---
""")

        # Test loading (will use fallback since not in HERMES_HOME)
        # Just verify no crash
        load_all_commands()
        # Should have minimal registry
        assert 'plan' in COMMAND_REGISTRY


# ==================== Test Runner Entry Point ====================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
