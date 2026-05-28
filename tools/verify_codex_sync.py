#!/usr/bin/env python3
"""Verify Mekong CLI Codex command and architecture registries."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
COMMAND_SOURCE_DIR = ROOT / ".claude" / "commands"
CODEX_COMMAND_DIR = ROOT / ".codex" / "commands"
COMMAND_REGISTRY_PATH = CODEX_COMMAND_DIR / "registry.json"
ARCH_REGISTRY_PATH = ROOT / ".codex" / "architecture" / "registry.json"


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _load_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def _relative_id(path: Path, root: Path) -> str:
    return path.relative_to(root).with_suffix("").as_posix()


def _command_ids(root: Path) -> set[str]:
    if not root.exists():
        return set()
    ids: set[str] = set()
    seen_dirs: set[Path] = set()
    for dirpath, dirnames, filenames in os.walk(root, followlinks=True):
        current_dir = Path(dirpath)
        real_dir = current_dir.resolve()
        if real_dir in seen_dirs:
            dirnames[:] = []
            continue
        seen_dirs.add(real_dir)
        dirnames[:] = sorted(name for name in dirnames if not name.startswith("__"))
        for filename in sorted(filenames):
            path = current_dir / filename
            if path.suffix == ".md" and path.is_file():
                ids.add(_relative_id(path, root))
    return ids


def _top_level_dirs(path: Path) -> list[str]:
    if not path.exists():
        return []
    return sorted(
        item.name for item in path.iterdir() if item.is_dir() and not item.name.startswith("__")
    )


def _count_files(path: Path, pattern: str) -> int:
    if not path.exists():
        return 0
    if pattern == "*.md":
        return len(_command_ids(path))
    return sum(1 for item in path.rglob(pattern) if item.is_file())


def _recipe_count(root: Path) -> int:
    recipes = root / "recipes"
    if not recipes.exists():
        return 0
    return sum(
        1 for item in recipes.rglob("*") if item.is_file() and item.suffix in {".json", ".md"}
    )


def _append(checks: list[dict[str, Any]], name: str, ok: bool, details: dict[str, Any]) -> None:
    checks.append({"name": name, "ok": bool(ok), "details": details})


def _verify_commands(root: Path, checks: list[dict[str, Any]]) -> dict[str, Any]:
    registry = _load_json(root / ".codex" / "commands" / "registry.json")
    source_ids = _command_ids(root / ".claude" / "commands")
    codex_ids = _command_ids(root / ".codex" / "commands")
    registry_commands = registry.get("commands", [])
    registry_ids = {item.get("id", "") for item in registry_commands}

    _append(
        checks,
        "command_schema",
        registry.get("schema_version") == "mekong.codex.commands.v1",
        {"schema_version": registry.get("schema_version")},
    )
    _append(
        checks,
        "command_counts",
        len(source_ids) == len(codex_ids) == len(registry_ids) == registry.get("total"),
        {
            "claude_commands": len(source_ids),
            "codex_commands": len(codex_ids),
            "registry_commands": len(registry_ids),
            "registry_total": registry.get("total"),
        },
    )
    _append(
        checks,
        "command_id_sets",
        source_ids == codex_ids == registry_ids,
        {
            "missing_from_codex": sorted(source_ids - codex_ids)[:20],
            "missing_from_registry": sorted(source_ids - registry_ids)[:20],
            "extra_in_registry": sorted(registry_ids - source_ids)[:20],
        },
    )

    hash_mismatches = []
    missing_prompt_files = []
    for item in registry_commands:
        source_path = root / item.get("source_path", "")
        codex_path = root / item.get("codex_path", "")
        if not codex_path.exists():
            missing_prompt_files.append(item.get("id", ""))
        if not source_path.exists() or _sha256(source_path) != item.get("content_sha256"):
            hash_mismatches.append(item.get("id", ""))
    _append(
        checks,
        "command_hashes",
        not hash_mismatches and not missing_prompt_files,
        {
            "hash_mismatches": hash_mismatches[:20],
            "missing_prompt_files": missing_prompt_files[:20],
        },
    )

    goals = next((item for item in registry_commands if item.get("id") == "goals"), {})
    _append(
        checks,
        "goal_alias",
        goals.get("slash") == "/goals" and "/goal" in goals.get("aliases", []),
        {"slash": goals.get("slash"), "aliases": goals.get("aliases", [])},
    )
    return registry


def _verify_architecture(root: Path, checks: list[dict[str, Any]]) -> dict[str, Any]:
    registry = _load_json(root / ".codex" / "architecture" / "registry.json")
    counts = registry.get("counts", {})
    expected_counts = {
        "claude_commands": _count_files(root / ".claude" / "commands", "*.md"),
        "codex_commands": _count_files(root / ".codex" / "commands", "*.md"),
        "command_contracts": _count_files(root / "factory" / "contracts" / "commands", "*.json"),
        "recipes": _recipe_count(root),
        "skills": _count_files(root / ".claude" / "skills", "SKILL.md"),
        "agents": _count_files(root / ".claude" / "agents", "*.md"),
        "layers": len(registry.get("layers", {})),
        "src_modules": len(_top_level_dirs(root / "src")),
        "packages": len(_top_level_dirs(root / "packages")),
        "apps": len(_top_level_dirs(root / "apps")),
    }
    mismatches = {
        key: {"expected": value, "actual": counts.get(key)}
        for key, value in expected_counts.items()
        if counts.get(key) != value
    }

    _append(
        checks,
        "architecture_schema",
        registry.get("schema_version") == "mekong.codex.architecture.v1",
        {"schema_version": registry.get("schema_version")},
    )
    _append(checks, "architecture_counts", not mismatches, {"mismatches": mismatches})

    source_mismatches = []
    for item in registry.get("source_docs", []):
        source_path = root / item.get("source_path", "")
        codex_path = root / item.get("codex_path", "")
        if (
            not source_path.exists()
            or not codex_path.exists()
            or _sha256(source_path) != item.get("sha256")
        ):
            source_mismatches.append(item.get("source_path", ""))
    _append(
        checks,
        "architecture_sources",
        len(registry.get("source_docs", [])) >= 6 and not source_mismatches,
        {
            "source_docs": len(registry.get("source_docs", [])),
            "source_mismatches": source_mismatches[:20],
        },
    )

    layers = registry.get("layers", {})
    contracts = {item.get("id") for item in registry.get("command_contracts", [])}
    recipes = {item.get("id") for item in registry.get("recipes", [])}
    _append(
        checks,
        "architecture_goal_surface",
        "founder" in layers
        and "goals" in layers.get("founder", {}).get("commands", [])
        and "goals" in contracts
        and "founder/goals" in recipes,
        {
            "has_founder": "founder" in layers,
            "has_goals_contract": "goals" in contracts,
            "has_goals_recipe": "founder/goals" in recipes,
        },
    )
    return registry


def _verify_docs_and_entrypoints(root: Path, checks: list[dict[str, Any]]) -> None:
    agents = (
        (root / "AGENTS.md").read_text(encoding="utf-8") if (root / "AGENTS.md").exists() else ""
    )
    codex_agents = (
        (root / ".codex" / "AGENTS.md").read_text(encoding="utf-8")
        if (root / ".codex" / "AGENTS.md").exists()
        else ""
    )
    pyproject = (
        (root / "pyproject.toml").read_text(encoding="utf-8")
        if (root / "pyproject.toml").exists()
        else ""
    )
    wrapper = (
        (root / "scripts" / "mekong-wrapper.sh").read_text(encoding="utf-8")
        if (root / "scripts" / "mekong-wrapper.sh").exists()
        else ""
    )

    required_agents = [
        ".codex/commands/registry.json",
        ".codex/architecture/registry.json",
        "codex-command /goal",
        "tools/verify_codex_sync.py --json",
    ]
    _append(
        checks,
        "root_agents_context",
        all(value in agents for value in required_agents),
        {"missing": [value for value in required_agents if value not in agents]},
    )
    _append(
        checks,
        "codex_agents_context",
        ".codex/architecture/registry.json" in codex_agents
        and "tools/verify_codex_sync.py --json" in codex_agents,
        {
            "has_architecture_registry": ".codex/architecture/registry.json" in codex_agents,
            "has_verifier": "tools/verify_codex_sync.py --json" in codex_agents,
        },
    )
    _append(
        checks,
        "mekong_entrypoint",
        'mekong = "src.main:entrypoint"' in pyproject,
        {"script": 'mekong = "src.main:entrypoint"' in pyproject},
    )
    _append(
        checks,
        "wrapper_registry_dispatch",
        "_is_registry_command" in wrapper and "-m src.main" in wrapper and "exec " in wrapper,
        {
            "has_registry_predicate": "_is_registry_command" in wrapper,
            "has_src_main_dispatch": "-m src.main" in wrapper and "exec " in wrapper,
        },
    )


def verify_codex_sync(root: Path = ROOT) -> dict[str, Any]:
    checks: list[dict[str, Any]] = []
    command_registry = _verify_commands(root, checks)
    architecture_registry = _verify_architecture(root, checks)
    _verify_docs_and_entrypoints(root, checks)
    return {
        "valid": all(check["ok"] for check in checks),
        "root": root.as_posix(),
        "commands": {
            "registry": ".codex/commands/registry.json",
            "total": command_registry.get("total", 0),
        },
        "architecture": {
            "registry": ".codex/architecture/registry.json",
            "counts": architecture_registry.get("counts", {}),
        },
        "checks": checks,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true", help="Print machine-readable output")
    args = parser.parse_args()

    report = verify_codex_sync()
    if args.json:
        print(json.dumps(report, indent=2, sort_keys=True))
    else:
        status = "valid" if report["valid"] else "invalid"
        print(
            f"Codex sync is {status}: {sum(1 for check in report['checks'] if check['ok'])}/{len(report['checks'])} checks passed"
        )
    sys.exit(0 if report["valid"] else 1)


if __name__ == "__main__":
    main()
