import importlib.util
import json
import subprocess
import sys
from pathlib import Path

from typer.testing import CliRunner

from src.cli.app_setup import build_app

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "tools" / "sync_codex_commands.py"


def _load_sync_module():
    spec = importlib.util.spec_from_file_location("sync_codex_commands", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def test_codex_registry_builder_includes_all_claude_commands():
    module = _load_sync_module()

    registry = module.build_registry()
    source_count = len(module._iter_command_files(ROOT / ".claude" / "commands"))

    assert registry["schema_version"] == "mekong.codex.commands.v1"
    assert registry["total"] == source_count
    assert registry["total"] == 505
    ids = {command["id"] for command in registry["commands"]}
    assert "goals" in ids
    assert "accounting-daily" in ids
    assert "mekong-cli" in ids
    assert "code/check" in ids
    goals = next(command for command in registry["commands"] if command["id"] == "goals")
    assert "/goal" in goals["aliases"]


def test_codex_registry_sync_writes_manifest_and_markdown(tmp_path):
    module = _load_sync_module()
    dest = tmp_path / "commands"
    registry_path = dest / "registry.json"

    registry = module.sync_codex_commands(dest_dir=dest, registry_path=registry_path)

    saved = json.loads(registry_path.read_text(encoding="utf-8"))
    assert saved["total"] == registry["total"]
    assert (dest / "goals.md").exists()
    assert (dest / "code" / "check.md").exists()
    goals_md = (dest / "goals.md").read_text(encoding="utf-8")
    assert 'codex-command: "/goals"' in goals_md
    assert "mekong goals $ARGUMENTS" in goals_md


def test_codex_command_resolver_expands_prompt_for_codex_cli_usage():
    result = CliRunner().invoke(
        build_app(),
        ["codex-command", "/goals", "deep", "config", "mekong-cli", "--json", "--check"],
    )

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["id"] == "goals"
    assert data["source_hash_valid"] is True
    assert data["invocation"] == "mekong goals deep config mekong-cli"
    assert "mekong goals deep config mekong-cli" in data["prompt"]
    assert "$ARGUMENTS" not in data["prompt"]


def test_codex_command_resolver_handles_nested_command_ids():
    result = CliRunner().invoke(
        build_app(),
        ["codex-command", "/code/check", "src/main.py", "--json", "--check"],
    )

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["id"] == "code/check"
    assert data["invocation"] == "mekong code/check src/main.py"


def test_codex_command_resolver_maps_goal_alias_to_goals():
    result = CliRunner().invoke(
        build_app(),
        ["codex-command", "/goal", "deep", "config", "mekong-cli", "--json", "--check"],
    )

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["requested"] == "/goal"
    assert data["id"] == "goals"
    assert data["slash"] == "/goals"
    assert data["invocation"] == "mekong goals deep config mekong-cli"


def test_codex_command_resolver_auto_syncs_stale_registry():
    registry_path = ROOT / ".codex" / "commands" / "registry.json"
    original = registry_path.read_text(encoding="utf-8")
    stale = json.loads(original)
    stale["commands"][0]["content_sha256"] = "stale"
    registry_path.write_text(json.dumps(stale, indent=2) + "\n", encoding="utf-8")
    try:
        result = CliRunner().invoke(
            build_app(),
            ["codex-command", "/goals", "auto", "refresh", "--json", "--check"],
        )
    finally:
        # Leave the worktree in the synced state expected by the rest of the suite.
        _load_sync_module().sync_codex_commands()

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["registry_synced"] is True
    assert data["registry_refreshed"] is True
    assert data["source_hash_valid"] is True


def test_registry_fallback_dispatches_unknown_root_command_from_main():
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "src.main",
            "4-project",
            "status",
            "--invocation",
            "--check",
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )

    assert result.returncode == 0
    assert result.stdout.strip() == "mekong 4-project status"
    assert "No such command" not in result.stderr


def test_registry_fallback_dispatches_goal_alias_from_main():
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "src.main",
            "/goal",
            "deep",
            "config",
            "--invocation",
            "--check",
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )

    assert result.returncode == 0
    assert result.stdout.strip() == "mekong goals deep config"
    assert "No such command" not in result.stderr
