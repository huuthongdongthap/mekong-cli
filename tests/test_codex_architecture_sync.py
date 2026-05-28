import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "tools" / "sync_codex_architecture.py"
VERIFY_SCRIPT = ROOT / "tools" / "verify_codex_sync.py"


def _load_sync_module():
    spec = importlib.util.spec_from_file_location("sync_codex_architecture", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def _load_verify_module():
    spec = importlib.util.spec_from_file_location("verify_codex_sync", VERIFY_SCRIPT)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def test_codex_architecture_registry_covers_current_mekong_surface():
    module = _load_sync_module()

    registry = module.build_architecture_registry()
    counts = registry["counts"]

    assert registry["schema_version"] == "mekong.codex.architecture.v1"
    assert counts["claude_commands"] == module._count(ROOT / ".claude" / "commands", "*.md")
    assert counts["codex_commands"] == len(list((ROOT / ".codex" / "commands").rglob("*.md")))
    assert counts["claude_commands"] == counts["codex_commands"]
    assert counts["command_contracts"] == len(
        list((ROOT / "factory" / "contracts" / "commands").rglob("*.json"))
    )
    assert counts["recipes"] >= 300
    assert len(registry["command_contracts"]) == counts["command_contracts"]
    assert len(registry["recipes"]) == counts["recipes"]
    assert counts["layers"] >= 6
    assert "founder" in registry["layers"]
    assert "goals" in registry["layers"]["founder"]["commands"]
    assert any(item["id"] == "goals" for item in registry["command_contracts"])
    assert any(item["id"] == "founder/goals" for item in registry["recipes"])
    assert "core" in registry["top_level"]["src_modules"]
    assert "mekong-cli-core" in registry["top_level"]["packages"]


def test_codex_architecture_sync_writes_registry_summary_sources_and_agents(tmp_path):
    module = _load_sync_module()
    arch_dir = tmp_path / "architecture"
    registry_path = arch_dir / "registry.json"
    agents_path = tmp_path / "AGENTS.md"

    registry = module.sync_codex_architecture(
        arch_dir=arch_dir,
        registry_path=registry_path,
        agents_path=agents_path,
    )

    saved = json.loads(registry_path.read_text(encoding="utf-8"))
    assert saved["counts"] == registry["counts"]
    assert len(saved["source_docs"]) >= 6
    assert (arch_dir / "ARCHITECTURE.md").exists()
    assert (arch_dir / "sources" / "ARCHITECTURE.md").exists()
    assert (arch_dir / "sources" / "factory__contracts__layers.json").exists()
    assert "Codex Registries" in agents_path.read_text(encoding="utf-8")


def test_codex_sync_verifier_accepts_current_command_architecture_context():
    module = _load_verify_module()

    report = module.verify_codex_sync()
    failed = [check for check in report["checks"] if not check["ok"]]

    assert report["valid"] is True, failed
    assert report["commands"]["total"] == 505
    assert report["architecture"]["counts"]["claude_commands"] == 505
    assert any(check["name"] == "goal_alias" and check["ok"] for check in report["checks"])
    assert any(check["name"] == "root_agents_context" and check["ok"] for check in report["checks"])
