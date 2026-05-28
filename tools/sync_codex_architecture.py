#!/usr/bin/env python3
"""Sync Mekong CLI architecture into Codex-native project context."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CODEX_DIR = ROOT / ".codex"
ARCH_DIR = CODEX_DIR / "architecture"
REGISTRY_PATH = ARCH_DIR / "registry.json"
AGENTS_PATH = CODEX_DIR / "AGENTS.md"

ARCHITECTURE_SOURCES = [
    "ARCHITECTURE.md",
    "docs/ARCHITECTURE.md",
    "README.md",
    "CLAUDE.md",
    "AGENTS.md",
    "factory/contracts/layers.json",
    "factory/contracts/commands.schema.json",
    "factory/contracts/agents.registry.json",
    "factory/contracts/skills.registry.json",
]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _json_path(path: Path, root: Path = ROOT) -> str:
    try:
        return path.relative_to(root).as_posix()
    except ValueError:
        return path.as_posix()


def _safe_source_name(path: str) -> str:
    return path.replace("/", "__")


def _count(pattern_root: Path, pattern: str) -> int:
    if not pattern_root.exists():
        return 0
    if pattern == "*.md":
        count = 0
        seen_dirs: set[Path] = set()
        for dirpath, dirnames, filenames in os.walk(pattern_root, followlinks=True):
            current_dir = Path(dirpath)
            real_dir = current_dir.resolve()
            if real_dir in seen_dirs:
                dirnames[:] = []
                continue
            seen_dirs.add(real_dir)
            dirnames[:] = sorted(name for name in dirnames if not name.startswith("__"))
            count += sum(1 for filename in filenames if (current_dir / filename).suffix == ".md")
        return count
    return sum(1 for path in pattern_root.rglob(pattern) if path.is_file())


def _top_level_dirs(path: Path) -> list[str]:
    if not path.exists():
        return []
    return sorted(
        item.name for item in path.iterdir() if item.is_dir() and not item.name.startswith("__")
    )


def _indexed_files(root_dir: Path, suffixes: set[str]) -> list[dict]:
    if not root_dir.exists():
        return []
    files = []
    for path in sorted(root_dir.rglob("*")):
        if not path.is_file() or path.suffix not in suffixes:
            continue
        rel_path = _json_path(path)
        item_id = path.relative_to(root_dir).with_suffix("").as_posix()
        files.append(
            {
                "id": item_id,
                "source_path": rel_path,
                "sha256": _sha256(path),
                "bytes": path.stat().st_size,
            }
        )
    return files


def _load_layers() -> dict:
    path = ROOT / "factory" / "contracts" / "layers.json"
    if not path.exists():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    layers = data.get("layers", {})
    if not isinstance(layers, dict):
        return {}
    output = {}
    for layer_id, layer in sorted(layers.items()):
        commands = layer.get("commands", [])
        output[layer_id] = {
            "role": layer.get("role", ""),
            "description": layer.get("description", ""),
            "hubs": layer.get("hubs", []),
            "cascades_to": layer.get("cascades_to", []),
            "command_count": len(commands) if isinstance(commands, list) else 0,
            "commands": commands if isinstance(commands, list) else [],
        }
    return output


def _source_docs(dest_sources: Path) -> list[dict]:
    docs = []
    dest_sources.mkdir(parents=True, exist_ok=True)
    for rel_path in ARCHITECTURE_SOURCES:
        source = ROOT / rel_path
        if not source.exists():
            continue
        dest = dest_sources / _safe_source_name(rel_path)
        shutil.copyfile(source, dest)
        docs.append(
            {
                "source_path": rel_path,
                "codex_path": _json_path(dest),
                "sha256": _sha256(source),
                "bytes": source.stat().st_size,
            }
        )
    return docs


def build_architecture_registry(
    arch_dir: Path = ARCH_DIR,
    root: Path = ROOT,
) -> dict:
    command_source_count = _count(root / ".claude" / "commands", "*.md")
    codex_command_count = _count(root / ".codex" / "commands", "*.md")
    layers = _load_layers()
    command_contracts = _indexed_files(root / "factory" / "contracts" / "commands", {".json"})
    recipes = _indexed_files(root / "recipes", {".json", ".md"})
    return {
        "schema_version": "mekong.codex.architecture.v1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "generated_by": "tools/sync_codex_architecture.py",
        "architecture_dir": _json_path(arch_dir, root),
        "command_registry": ".codex/commands/registry.json",
        "counts": {
            "claude_commands": command_source_count,
            "codex_commands": codex_command_count,
            "command_contracts": len(command_contracts),
            "recipes": len(recipes),
            "skills": _count(root / ".claude" / "skills", "SKILL.md"),
            "agents": _count(root / ".claude" / "agents", "*.md"),
            "layers": len(layers),
            "src_modules": len(_top_level_dirs(root / "src")),
            "packages": len(_top_level_dirs(root / "packages")),
            "apps": len(_top_level_dirs(root / "apps")),
        },
        "command_contracts": command_contracts,
        "recipes": recipes,
        "layers": layers,
        "top_level": {
            "src_modules": _top_level_dirs(root / "src"),
            "packages": _top_level_dirs(root / "packages"),
            "apps": _top_level_dirs(root / "apps"),
        },
    }


def _architecture_markdown(registry: dict) -> str:
    counts = registry["counts"]
    layer_rows = []
    for layer_id, layer in registry["layers"].items():
        hubs = ", ".join(layer.get("hubs", [])) or "-"
        cascades = ", ".join(layer.get("cascades_to", [])) or "-"
        layer_rows.append(
            f"| `{layer_id}` | {layer.get('role', '')} | {layer['command_count']} | {hubs} | {cascades} |"
        )

    src_modules = ", ".join(f"`{name}`" for name in registry["top_level"]["src_modules"])
    packages = ", ".join(f"`{name}`" for name in registry["top_level"]["packages"])
    apps = ", ".join(f"`{name}`" for name in registry["top_level"]["apps"])
    return (
        "# Mekong CLI Architecture for Codex\n\n"
        "This file is generated from Mekong CLI architecture sources for Codex-native context.\n\n"
        "## Snapshot\n\n"
        f"- Claude command sources: `{counts['claude_commands']}`\n"
        f"- Codex command prompts: `{counts['codex_commands']}`\n"
        f"- Command contracts: `{counts['command_contracts']}`\n"
        f"- Recipes: `{counts['recipes']}`\n"
        f"- Skills: `{counts['skills']}`\n"
        f"- Agents: `{counts['agents']}`\n"
        f"- Layers: `{counts['layers']}`\n\n"
        "## Layers\n\n"
        "| Layer | Role | Commands | Hubs | Cascades To |\n"
        "|---|---:|---:|---|---|\n" + "\n".join(layer_rows) + "\n\n"
        "## Code Surface\n\n"
        f"- `src/`: {src_modules}\n"
        f"- `packages/`: {packages}\n"
        f"- `apps/`: {apps}\n\n"
        "## Codex Artifacts\n\n"
        "- `.codex/commands/registry.json`: command manifest generated from `.claude/commands/**/*.md`\n"
        "- `.codex/commands/**/*.md`: Codex command prompts that dispatch through `mekong <command> $ARGUMENTS`\n"
        "- `.codex/architecture/registry.json`: architecture manifest with counts, layer map, contract index, recipe index, and source hashes\n"
        "- `.codex/architecture/sources/`: copied architecture source documents for Codex inspection\n"
        "- `tools/verify_codex_sync.py --json`: self-check for command, architecture, docs, and wrapper wiring\n"
    )


def _agents_markdown(registry: dict) -> str:
    counts = registry["counts"]
    return (
        "# AGENTS.md - Mekong CLI v6.0 (Codex Native)\n\n"
        "## Identity\n"
        "You are working in `~/mekong-cli`, an AI-operated business automation platform.\n"
        "Use the Codex-native registries below before falling back to broad repo scans.\n\n"
        "## Codex Registries\n"
        "- Commands: `.codex/commands/registry.json`\n"
        "- Command prompts: `.codex/commands/**/*.md`\n"
        "- Architecture: `.codex/architecture/registry.json`\n"
        "- Architecture summary: `.codex/architecture/ARCHITECTURE.md`\n"
        "- Source copies: `.codex/architecture/sources/`\n\n"
        "## Current Snapshot\n"
        f"- Commands: `{counts['codex_commands']}` Codex prompts ({counts['codex_commands']} total: 404 flat + 101 namespaced: ci:5, git:10, trading:44, code:6, sdlc:4, raas:20, utils:3, tasks:2, context:3, docs:2, legal:1, finance:1)\n"
        f"- Contracts: `{counts['command_contracts']}` command JSON contracts\n"
        f"- Recipes: `{counts['recipes']}` JSON/Markdown recipes\n"
        f"- Skills: `{counts['skills']}` Claude skill definitions\n"
        f"- Agents: `{counts['agents']}` Claude agent definitions\n"
        f"- Architecture layers: `{counts['layers']}` from `factory/contracts/layers.json`\n\n"
        "## Command System\n"
        "Namespace commands use `:` separator: `trading:ceo`, `git:commit`, `ci:run-ci`.\n"
        "Source: `.claude/commands/` (top-level .md) + subdirs (`git/`, `trading/`, `ci/`, etc.)\n"
        "Invocation: `mekong <name> $ARGUMENTS`\n\n"
        "### Layer Map\n"
        "| Layer | Commands |\n"
        "|-------|----------|\n"
        "| Studio | 23 cmds (studio:launch, dealflow, venture, expert) |\n"
        "| Founder | 52 cmds (annual, okr, fundraise, swot) |\n"
        "| Business | 71 cmds (sales, marketing, finance, hr) |\n"
        "| Product | 31 cmds (plan, sprint, roadmap) |\n"
        "| Engineering | 66 cmds (cook, code, test, deploy, review) |\n"
        "| Ops | 41 cmds (audit, health, security, status) |\n"
        "| Trading | 44 cmds (trading:ceo, trading:cto, trading:auto:fast...) |\n"
        "| CI/CD | 5 cmds (ci:run-ci, ci:deploy, ci:debugger...) |\n"
        "| Git | 10 cmds (git:commit, git:create-pr, git:rebase...) |\n"
        "| Utils | 3 cmds (utils:search, utils:refactor, utils:mermaid) |\n\n"
        "## Execution Protocol\n"
        "- Output: Command → Result → Next task. No explanations, no greetings.\n"
        "- Run commands from `/Users/mac/mekong-cli`.\n"
        "- Dispatch: `mekong <name> $ARGUMENTS` or `bash scripts/mekong-wrapper.sh <name> $ARGUMENTS`\n"
        "- Codex auto mode: `codex --ask-for-approval never --sandbox workspace-write`\n"
        "- 2 STRIKES & MAX: 2 failed fixes → STOP, report to user\n"
        "- Silent flags: `--silent`, `-q`, `> /dev/null` for all package managers\n\n"
        "## Maintenance\n"
        "- Sync Codex commands: `python3 tools/sync_codex_commands.py --json`\n"
        "- Full sync: `python3 tools/sync_codex.py --json`\n"
        "- Verify: `python3 tools/verify_codex_sync.py --json`\n"
        "- OpenCode DB sync: `python3 setup-mekong.py`\n"
    )


def sync_codex_architecture(
    arch_dir: Path = ARCH_DIR,
    registry_path: Path = REGISTRY_PATH,
    agents_path: Path = AGENTS_PATH,
    root: Path = ROOT,
) -> dict:
    arch_dir.mkdir(parents=True, exist_ok=True)
    sources_dir = arch_dir / "sources"
    registry = build_architecture_registry(arch_dir=arch_dir, root=root)
    registry["source_docs"] = _source_docs(sources_dir)

    (arch_dir / "ARCHITECTURE.md").write_text(_architecture_markdown(registry), encoding="utf-8")
    registry_path.write_text(json.dumps(registry, indent=2) + "\n", encoding="utf-8")
    agents_path.parent.mkdir(parents=True, exist_ok=True)
    agents_path.write_text(_agents_markdown(registry), encoding="utf-8")
    return registry


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--arch-dir", type=Path, default=ARCH_DIR)
    parser.add_argument("--registry", type=Path, default=REGISTRY_PATH)
    parser.add_argument("--agents", type=Path, default=AGENTS_PATH)
    parser.add_argument("--json", action="store_true", help="Print machine-readable output")
    args = parser.parse_args()

    registry = sync_codex_architecture(
        arch_dir=args.arch_dir,
        registry_path=args.registry,
        agents_path=args.agents,
        root=ROOT,
    )
    output = {
        "registry": _json_path(args.registry),
        "architecture": _json_path(args.arch_dir / "ARCHITECTURE.md"),
        "agents": _json_path(args.agents),
        "counts": registry["counts"],
        "source_docs": len(registry["source_docs"]),
    }
    if args.json:
        print(json.dumps(output, indent=2))
    else:
        print(f"Synced architecture to {output['registry']}")


if __name__ == "__main__":
    main()
