import json
import os
import subprocess
from pathlib import Path

from typer.testing import CliRunner

from src.cli.app_setup import build_app
from src.core.command_authorizer import COMMAND_TIER_MAP
from src.core.command_loader import find_best_command, load_all_commands

ROOT = Path(__file__).resolve().parents[1]


def test_codex_adapter_uses_current_auto_flags():
    cmd = "source mekong/adapters/registry.sh\n" "get_launch_cmd codex /tmp/mekong-workspace"

    result = subprocess.run(
        ["bash", "-lc", cmd],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    )

    assert result.stdout.strip() == (
        "cd /tmp/mekong-workspace && " "codex --ask-for-approval never --sandbox workspace-write"
    )


def test_cook_accepts_auto_flag_in_help():
    result = CliRunner().invoke(build_app(), ["cook", "--help"])

    assert result.exit_code == 0
    assert "--auto" in result.output


def test_goals_command_loads_with_codex_auto_policy():
    commands = {command.id: command for command in load_all_commands()}

    assert "goals" in commands
    assert "codex --ask-for-approval never --sandbox workspace-write" in commands["goals"].content


def test_slash_goals_matches_command_loader():
    command = find_best_command("/goals deep config mekong-cli command of codex --auto")

    assert command is not None
    assert command.id == "goals"


def test_founder_goals_recipe_is_indexed():
    index = json.loads((ROOT / "recipes/founder/INDEX.json").read_text())
    recipe = json.loads((ROOT / "recipes/founder/goals.json").read_text())
    contract = json.loads((ROOT / "factory/contracts/commands/goals.json").read_text())

    assert any(item["id"] == "goals" and item["file"] == "goals.json" for item in index["recipes"])
    assert recipe["trigger"] == "/goals"
    assert recipe["dag"]["groups"][1]["id"] == "codex-auto"
    assert contract["input"]["properties"]["provider"]["enum"] == [
        "auto",
        "codex",
        "claude",
        "gemini",
        "opencode",
        "aider",
    ]
    assert contract["input"]["properties"]["approval_policy"]["enum"] == [
        "untrusted",
        "on-request",
        "never",
    ]


def test_goals_cli_outputs_effective_codex_auto_config():
    result = CliRunner().invoke(
        build_app(),
        ["goals", "deep", "config", "mekong-cli", "command", "of", "codex", "--auto", "--json"],
    )

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["command"] == "goals"
    assert data["trigger"] == "/goals"
    assert data["contract"] == "factory/contracts/commands/goals.json"
    assert data["dag_groups"] == ["deep-config", "codex-auto", "goal-output"]
    assert data["command_config"]["provider"] == "codex"
    assert data["command_config"]["mode"] == "auto"
    assert data["command_config"]["approval_policy"] == "never"
    assert data["command_config"]["sandbox"] == "workspace-write"
    assert data["codex_auto_command"].endswith(
        "codex --ask-for-approval never --sandbox workspace-write"
    )


def test_goals_command_is_free_to_authorize_like_cook():
    assert "goals" in COMMAND_TIER_MAP
    assert COMMAND_TIER_MAP["goals"].requires_license is False


def test_config_command_group_is_registered():
    result = CliRunner().invoke(build_app(), ["config", "--help"])

    assert result.exit_code == 0
    assert "command" in result.output


def test_config_command_outputs_goals_contract_config():
    result = CliRunner().invoke(
        build_app(),
        ["config", "command", "/goals", "--auto", "--json"],
    )

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["command"] == "goals"
    assert data["contract"] == "factory/contracts/commands/goals.json"
    assert data["recipe"] == "recipes/founder/goals.json"
    assert data["command_file"] == ".claude/commands/goals.md"
    assert data["provider"] == "codex"
    assert data["mode"] == "auto"
    assert data["approval_policy"] == "never"
    assert data["sandbox"] == "workspace-write"
    assert data["auto_command"].endswith("codex --ask-for-approval never --sandbox workspace-write")


def test_config_command_apply_persists_goals_default(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))

    apply_result = CliRunner().invoke(
        build_app(),
        ["config", "command", "/goals", "--auto", "--apply", "--json"],
    )

    assert apply_result.exit_code == 0
    saved_path = tmp_path / "command-config.json"
    assert saved_path.exists()
    saved_data = json.loads(saved_path.read_text())
    assert saved_data["commands"]["goals"]["mode"] == "auto"
    assert saved_data["commands"]["goals"]["provider"] == "codex"

    read_result = CliRunner().invoke(
        build_app(),
        ["config", "command", "/goals", "--json"],
    )

    assert read_result.exit_code == 0
    read_data = json.loads(read_result.output)
    assert read_data["saved_config"]["mode"] == "auto"
    assert read_data["saved_config"]["sandbox"] == "workspace-write"


def test_goals_cli_uses_persisted_default_when_no_auto_flag(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))

    apply_result = CliRunner().invoke(
        build_app(),
        ["config", "command", "/goals", "--auto", "--apply", "--json"],
    )
    assert apply_result.exit_code == 0

    result = CliRunner().invoke(
        build_app(),
        ["goals", "deep", "config", "mekong", "command", "--json"],
    )

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["config_source"] == "saved"
    assert data["command_config"]["provider"] == "codex"
    assert data["command_config"]["mode"] == "auto"
    assert data["codex_auto_command"].endswith(
        "codex --ask-for-approval never --sandbox workspace-write"
    )


def test_config_commands_lists_and_clears_saved_defaults(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))

    apply_result = CliRunner().invoke(
        build_app(),
        ["config", "command", "/goals", "--auto", "--apply", "--json"],
    )
    assert apply_result.exit_code == 0

    list_result = CliRunner().invoke(build_app(), ["config", "commands", "--json"])
    assert list_result.exit_code == 0
    list_data = json.loads(list_result.output)
    assert list_data["count"] == 1
    assert list_data["commands"]["goals"]["mode"] == "auto"

    clear_result = CliRunner().invoke(
        build_app(),
        ["config", "command-clear", "/goals", "--json"],
    )
    assert clear_result.exit_code == 0
    clear_data = json.loads(clear_result.output)
    assert clear_data["removed"] is True

    list_after_clear = CliRunner().invoke(build_app(), ["config", "commands", "--json"])
    assert list_after_clear.exit_code == 0
    assert json.loads(list_after_clear.output)["count"] == 0

    goals_result = CliRunner().invoke(
        build_app(),
        ["goals", "deep", "config", "mekong", "command", "--json"],
    )
    assert goals_result.exit_code == 0
    goals_data = json.loads(goals_result.output)
    assert goals_data["config_source"] == "default"
    assert goals_data["command_config"]["mode"] == "plan"


def test_config_command_validate_accepts_saved_goals_default(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))

    apply_result = CliRunner().invoke(
        build_app(),
        ["config", "command", "/goals", "--auto", "--apply", "--json"],
    )
    assert apply_result.exit_code == 0

    validate_result = CliRunner().invoke(
        build_app(),
        ["config", "command-validate", "/goals", "--json"],
    )

    assert validate_result.exit_code == 0
    data = json.loads(validate_result.output)
    assert data["valid"] is True
    assert data["results"][0]["command"] == "goals"
    assert data["results"][0]["errors"] == []


def test_config_command_validate_rejects_bad_codex_auto_policy(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))
    saved_path = tmp_path / "command-config.json"
    saved_path.write_text(
        json.dumps(
            {
                "version": "1.0.0",
                "commands": {
                    "goals": {
                        "command": "goals",
                        "contract": "factory/contracts/commands/goals.json",
                        "recipe": "recipes/founder/goals.json",
                        "command_file": ".claude/commands/goals.md",
                        "provider": "codex",
                        "mode": "auto",
                        "approval_policy": "on-request",
                        "sandbox": "read-only",
                        "auto_command": "codex --auto",
                    }
                },
            }
        )
    )

    validate_result = CliRunner().invoke(
        build_app(),
        ["config", "command-validate", "/goals", "--json"],
    )

    assert validate_result.exit_code == 1
    data = json.loads(validate_result.output)
    assert data["valid"] is False
    assert "codex auto requires approval_policy=never" in data["results"][0]["errors"]
    assert "codex auto requires sandbox=workspace-write" in data["results"][0]["errors"]
    assert "codex auto command does not match adapter policy" in data["results"][0]["errors"]


def test_config_command_repair_fixes_bad_goals_default(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))
    saved_path = tmp_path / "command-config.json"
    saved_path.write_text(
        json.dumps(
            {
                "version": "1.0.0",
                "commands": {
                    "goals": {
                        "command": "goals",
                        "contract": "factory/contracts/commands/goals.json",
                        "recipe": "recipes/founder/goals.json",
                        "command_file": ".claude/commands/goals.md",
                        "provider": "codex",
                        "mode": "auto",
                        "approval_policy": "on-request",
                        "sandbox": "read-only",
                        "auto_command": "codex --auto",
                    }
                },
            }
        )
    )

    repair_result = CliRunner().invoke(
        build_app(),
        ["config", "command-repair", "/goals", "--json"],
    )

    assert repair_result.exit_code == 0
    repair_data = json.loads(repair_result.output)
    assert repair_data["repaired"] is True
    assert repair_data["config"]["approval_policy"] == "never"
    assert repair_data["config"]["sandbox"] == "workspace-write"
    assert repair_data["config"]["auto_command"].endswith(
        "codex --ask-for-approval never --sandbox workspace-write"
    )

    validate_result = CliRunner().invoke(
        build_app(),
        ["config", "command-validate", "/goals", "--json"],
    )
    assert validate_result.exit_code == 0
    assert json.loads(validate_result.output)["valid"] is True


def test_config_commands_export_and_import_defaults(tmp_path, monkeypatch):
    config_dir = tmp_path / "config"
    export_path = tmp_path / "backup" / "command-config.json"
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(config_dir))

    apply_result = CliRunner().invoke(
        build_app(),
        ["config", "command", "/goals", "--auto", "--apply", "--json"],
    )
    assert apply_result.exit_code == 0

    export_result = CliRunner().invoke(
        build_app(),
        ["config", "commands-export", "--output", str(export_path), "--json"],
    )
    assert export_result.exit_code == 0
    export_data = json.loads(export_result.output)
    assert export_data["count"] == 1
    assert export_path.exists()

    clear_result = CliRunner().invoke(
        build_app(),
        ["config", "command-clear", "/goals", "--json"],
    )
    assert clear_result.exit_code == 0

    import_result = CliRunner().invoke(
        build_app(),
        ["config", "commands-import", "--input", str(export_path), "--json"],
    )
    assert import_result.exit_code == 0
    import_data = json.loads(import_result.output)
    assert import_data["imported"] == 1
    assert import_data["total"] == 1

    list_result = CliRunner().invoke(build_app(), ["config", "commands", "--json"])
    assert list_result.exit_code == 0
    list_data = json.loads(list_result.output)
    assert list_data["commands"]["goals"]["mode"] == "auto"


def test_config_commands_sync_repairs_invalid_defaults(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))
    saved_path = tmp_path / "command-config.json"
    saved_path.write_text(
        json.dumps(
            {
                "version": "1.0.0",
                "commands": {
                    "goals": {
                        "command": "goals",
                        "contract": "factory/contracts/commands/goals.json",
                        "recipe": "recipes/founder/goals.json",
                        "command_file": ".claude/commands/goals.md",
                        "provider": "codex",
                        "mode": "auto",
                        "approval_policy": "on-request",
                        "sandbox": "read-only",
                        "auto_command": "codex --auto",
                    }
                },
            }
        )
    )

    dry_run = CliRunner().invoke(build_app(), ["config", "commands-sync", "--dry-run", "--json"])
    assert dry_run.exit_code == 0
    dry_run_data = json.loads(dry_run.output)
    assert dry_run_data["checked"] == 1
    assert dry_run_data["repaired"][0]["dry_run"] is True
    assert (
        "codex auto requires approval_policy=never" in dry_run_data["repaired"][0]["before_errors"]
    )

    still_bad = json.loads(saved_path.read_text())
    assert still_bad["commands"]["goals"]["approval_policy"] == "on-request"

    sync = CliRunner().invoke(build_app(), ["config", "commands-sync", "--json"])
    assert sync.exit_code == 0
    sync_data = json.loads(sync.output)
    assert sync_data["repaired"][0]["command"] == "goals"

    repaired = json.loads(saved_path.read_text())
    assert repaired["commands"]["goals"]["approval_policy"] == "never"
    assert repaired["commands"]["goals"]["sandbox"] == "workspace-write"


def test_config_validate_accepts_valid_saved_command_default(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))
    monkeypatch.setenv("ANTHROPIC_BASE_URL", "https://llm.example.test")
    monkeypatch.setenv("ANTHROPIC_MODEL", "test-model")
    monkeypatch.setenv("MEKONG_API_TOKEN", "test-token")

    apply_result = CliRunner().invoke(
        build_app(),
        ["config", "command", "/goals", "--auto", "--apply", "--json"],
    )
    assert apply_result.exit_code == 0

    validate_result = CliRunner().invoke(build_app(), ["config", "validate"])
    assert validate_result.exit_code == 0
    assert "Configuration is valid" in validate_result.output


def test_config_validate_rejects_invalid_saved_command_default(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))
    monkeypatch.setenv("ANTHROPIC_BASE_URL", "https://llm.example.test")
    monkeypatch.setenv("ANTHROPIC_MODEL", "test-model")
    saved_path = tmp_path / "command-config.json"
    saved_path.write_text(
        json.dumps(
            {
                "version": "1.0.0",
                "commands": {
                    "goals": {
                        "command": "goals",
                        "contract": "factory/contracts/commands/goals.json",
                        "recipe": "recipes/founder/goals.json",
                        "command_file": ".claude/commands/goals.md",
                        "provider": "codex",
                        "mode": "auto",
                        "approval_policy": "on-request",
                        "sandbox": "read-only",
                        "auto_command": "codex --auto",
                    }
                },
            }
        )
    )

    validate_result = CliRunner().invoke(build_app(), ["config", "validate"])

    assert validate_result.exit_code == 1
    assert (
        "Command config goals: codex auto requires approval_policy=never" in validate_result.output
    )
    assert (
        "Command config goals: codex auto requires sandbox=workspace-write"
        in validate_result.output
    )


def test_config_command_diff_reports_no_drift_for_current_default(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))

    apply_result = CliRunner().invoke(
        build_app(),
        ["config", "command", "/goals", "--auto", "--apply", "--json"],
    )
    assert apply_result.exit_code == 0

    diff_result = CliRunner().invoke(
        build_app(),
        ["config", "command-diff", "/goals", "--json"],
    )

    assert diff_result.exit_code == 0
    data = json.loads(diff_result.output)
    assert data["saved"] is True
    assert data["changed"] is False
    assert data["changes"] == []


def test_config_command_diff_reports_drift_for_bad_default(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))
    saved_path = tmp_path / "command-config.json"
    saved_path.write_text(
        json.dumps(
            {
                "version": "1.0.0",
                "commands": {
                    "goals": {
                        "command": "goals",
                        "contract": "factory/contracts/commands/goals.json",
                        "recipe": "recipes/founder/goals.json",
                        "command_file": ".claude/commands/goals.md",
                        "provider": "codex",
                        "mode": "auto",
                        "approval_policy": "on-request",
                        "sandbox": "read-only",
                        "auto_command": "codex --auto",
                    }
                },
            }
        )
    )

    diff_result = CliRunner().invoke(
        build_app(),
        ["config", "command-diff", "/goals", "--json"],
    )

    assert diff_result.exit_code == 0
    data = json.loads(diff_result.output)
    assert data["changed"] is True
    changed_fields = {change["field"] for change in data["changes"]}
    assert "approval_policy" in changed_fields
    assert "sandbox" in changed_fields
    assert "auto_command" in changed_fields


def test_config_command_supports_mekong_cli_auto(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))

    result = CliRunner().invoke(
        build_app(),
        ["config", "command", "mekong-cli", "--auto", "--apply", "--json"],
    )

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["command"] == "mekong-cli"
    assert data["contract"] == "factory/contracts/commands/mekong-cli.json"
    assert data["command_file"] == ".claude/commands/mekong-cli.md"
    assert data["recipe"] == "recipes/ops/mekong-cli.json"
    assert data["provider"] == "codex"
    assert data["mode"] == "auto"
    assert data["requires_license"] is False
    assert data["tier"] == "free"
    assert data["auto_command"].endswith("codex --ask-for-approval never --sandbox workspace-write")

    validate_result = CliRunner().invoke(
        build_app(),
        ["config", "command-validate", "mekong-cli", "--json"],
    )
    assert validate_result.exit_code == 0
    assert json.loads(validate_result.output)["valid"] is True


def test_mekong_cli_command_uses_saved_default(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))

    apply_result = CliRunner().invoke(
        build_app(),
        ["config", "command", "mekong-cli", "--auto", "--apply", "--json"],
    )
    assert apply_result.exit_code == 0

    result = CliRunner().invoke(build_app(), ["mekong-cli", "--json"])

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["command"] == "mekong-cli"
    assert data["config_source"] == "saved"
    assert data["command_config"]["provider"] == "codex"
    assert data["command_config"]["mode"] == "auto"
    assert data["command_config"]["approval_policy"] == "never"
    assert data["command_config"]["sandbox"] == "workspace-write"
    assert data["command_config"]["auto_command"].endswith(
        "codex --ask-for-approval never --sandbox workspace-write"
    )


def test_mekong_cli_auto_shortcut_persists_default(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))

    result = CliRunner().invoke(build_app(), ["mekong-cli", "--auto", "--json"])

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["config_source"] == "saved"
    assert data["command_config"]["provider"] == "codex"
    assert data["command_config"]["mode"] == "auto"
    assert data["command_config"]["approval_policy"] == "never"
    saved_data = json.loads((tmp_path / "command-config.json").read_text())
    assert saved_data["commands"]["mekong-cli"]["mode"] == "auto"


def test_config_command_mekong_cli_auto_persists_without_apply(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))

    result = CliRunner().invoke(
        build_app(),
        ["config", "command", "mekong-cli", "--auto", "--json"],
    )

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["saved_config_path"] == str(tmp_path / "command-config.json")

    saved_data = json.loads((tmp_path / "command-config.json").read_text())
    assert saved_data["commands"]["mekong-cli"]["mode"] == "auto"
    assert saved_data["commands"]["mekong-cli"]["provider"] == "codex"
    assert "saved_config" not in saved_data["commands"]["mekong-cli"]
    assert "saved_validation" not in saved_data["commands"]["mekong-cli"]
    assert "saved_drift" not in saved_data["commands"]["mekong-cli"]


def test_wrapper_dispatches_native_config_command(tmp_path):
    env = os.environ.copy()
    env["MEKONG_CONFIG_DIR"] = str(tmp_path)

    result = subprocess.run(
        [
            "bash",
            "scripts/mekong-wrapper.sh",
            "config",
            "command",
            "mekong-cli",
            "--auto",
            "--json",
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
        env=env,
        timeout=10,
    )

    assert result.returncode == 0
    data = json.loads(result.stdout)
    assert data["command"] == "mekong-cli"
    assert data["mode"] == "auto"
    assert data["provider"] == "codex"


def test_config_command_mekong_cli_reports_saved_validation_and_drift(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))

    apply_result = CliRunner().invoke(
        build_app(),
        ["config", "command", "mekong-cli", "--auto", "--json"],
    )
    assert apply_result.exit_code == 0

    result = CliRunner().invoke(
        build_app(),
        ["config", "command", "mekong-cli", "--auto", "--json"],
    )

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["saved_validation"]["valid"] is True
    assert data["saved_validation"]["errors"] == []
    assert data["saved_drift"]["changed"] is False
    assert data["saved_drift"]["changes"] == []


def test_config_command_mekong_cli_reports_saved_drift(tmp_path, monkeypatch):
    monkeypatch.setenv("MEKONG_CONFIG_DIR", str(tmp_path))
    saved_path = tmp_path / "command-config.json"
    saved_path.write_text(
        json.dumps(
            {
                "version": "1.0.0",
                "commands": {
                    "mekong-cli": {
                        "command": "mekong-cli",
                        "contract": "factory/contracts/commands/mekong-cli.json",
                        "recipe": "recipes/ops/mekong-cli.json",
                        "command_file": ".claude/commands/mekong-cli.md",
                        "provider": "codex",
                        "mode": "auto",
                        "approval_policy": "on-request",
                        "sandbox": "read-only",
                        "auto_command": "codex --auto",
                    }
                },
            }
        )
    )

    result = CliRunner().invoke(
        build_app(),
        ["config", "command", "mekong-cli", "--auto", "--json"],
    )

    assert result.exit_code == 0
    data = json.loads(result.output)
    assert data["saved_validation"]["valid"] is False
    assert data["saved_drift"]["changed"] is True
    changed_fields = {change["field"] for change in data["saved_drift"]["changes"]}
    assert "approval_policy" in changed_fields
    assert "sandbox" in changed_fields
    assert "auto_command" in changed_fields
