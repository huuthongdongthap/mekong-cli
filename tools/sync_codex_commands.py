#!/usr/bin/env python3
"""Sync Claude slash commands into a Codex-native command registry."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / ".claude" / "commands"
DEST_DIR = ROOT / ".codex" / "commands"
REGISTRY_PATH = DEST_DIR / "registry.json"
COMMAND_ALIASES = {
    "goals": ["goal"],
}


@dataclass(frozen=True)
class ParsedCommand:
    command_id: str
    source_path: Path
    dest_path: Path
    description: str
    argument_hint: str
    allowed_tools: list[str]
    body: str
    raw: str


def _parse_frontmatter(text: str) -> tuple[dict[str, str], str]:
    if not text.startswith("---"):
        return {}, text.strip()

    end = text.find("\n---", 3)
    if end == -1:
        return {}, text.strip()

    metadata: dict[str, str] = {}
    for line in text[3:end].strip().splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        metadata[key.strip()] = value.strip().strip('"').strip("'")
    return metadata, text[end + 4 :].strip()


def _split_tools(raw: str) -> list[str]:
    value = raw.strip()
    if not value:
        return []
    if value.startswith("[") and value.endswith("]"):
        value = value[1:-1]
    return [item.strip().strip('"').strip("'") for item in value.split(",") if item.strip()]


def _command_id(path: Path, source_dir: Path) -> str:
    return path.relative_to(source_dir).with_suffix("").as_posix()


def _iter_command_files(source_dir: Path) -> list[Path]:
    """Return command markdown files, following symlinked command namespaces once."""
    if not source_dir.exists():
        return []

    files: list[Path] = []
    seen_dirs: set[Path] = set()
    for dirpath, dirnames, filenames in os.walk(source_dir, followlinks=True):
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
                files.append(path)
    return sorted(files, key=lambda path: path.relative_to(source_dir).as_posix())


def _read_command(path: Path, source_dir: Path, dest_dir: Path) -> ParsedCommand:
    raw = path.read_text(encoding="utf-8")
    metadata, body = _parse_frontmatter(raw)
    command_id = _command_id(path, source_dir)
    return ParsedCommand(
        command_id=command_id,
        source_path=path,
        dest_path=dest_dir / path.relative_to(source_dir),
        description=metadata.get("description", f"Mekong command: {command_id}"),
        argument_hint=metadata.get("argument-hint", "$ARGUMENTS"),
        allowed_tools=_split_tools(metadata.get("allowed-tools", "")),
        body=body,
        raw=raw,
    )


def _sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _json_path(path: Path, root: Path) -> str:
    try:
        return path.relative_to(root).as_posix()
    except ValueError:
        return path.as_posix()


def _codex_markdown(command: ParsedCommand, root: Path) -> str:
    source = _json_path(command.source_path, root)
    invocation = f"mekong {command.command_id} $ARGUMENTS"
    tools = ", ".join(command.allowed_tools) if command.allowed_tools else "default"
    return (
        "---\n"
        f'codex-command: "/{command.command_id}"\n'
        f'source: "{source}"\n'
        f'invocation: "{invocation}"\n'
        f'description: "{command.description}"\n'
        f'argument-hint: "{command.argument_hint}"\n'
        f'allowed-tools: "{tools}"\n'
        f'content-sha256: "{_sha256(command.raw)}"\n'
        "---\n\n"
        f"# /{command.command_id}\n\n"
        "Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.\n\n"
        "```bash\n"
        f"{invocation}\n"
        "```\n\n"
        "## Source Command\n\n"
        f"{command.body}\n"
    )


def build_registry(
    source_dir: Path = SOURCE_DIR,
    dest_dir: Path = DEST_DIR,
    root: Path = ROOT,
) -> dict:
    commands = []
    for source_path in _iter_command_files(source_dir):
        command = _read_command(source_path, source_dir, dest_dir)
        commands.append(
            {
                "id": command.command_id,
                "slash": f"/{command.command_id}",
                "aliases": [f"/{alias}" for alias in COMMAND_ALIASES.get(command.command_id, [])],
                "source_path": _json_path(command.source_path, root),
                "codex_path": _json_path(command.dest_path, root),
                "description": command.description,
                "argument_hint": command.argument_hint,
                "allowed_tools": command.allowed_tools,
                "invocation": f"mekong {command.command_id} $ARGUMENTS",
                "content_sha256": _sha256(command.raw),
            }
        )

    return {
        "schema_version": "mekong.codex.commands.v1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "generated_by": "tools/sync_codex_commands.py",
        "source_dir": _json_path(source_dir, root),
        "registry_path": _json_path(dest_dir / "registry.json", root),
        "total": len(commands),
        "commands": commands,
    }


def sync_codex_commands(
    source_dir: Path = SOURCE_DIR,
    dest_dir: Path = DEST_DIR,
    registry_path: Path = REGISTRY_PATH,
    root: Path = ROOT,
    prune: bool = True,
) -> dict:
    dest_dir.mkdir(parents=True, exist_ok=True)

    registry = build_registry(source_dir=source_dir, dest_dir=dest_dir, root=root)
    generated_paths = set()
    for item in registry["commands"]:
        source_path = root / item["source_path"]
        command = _read_command(source_path, source_dir, dest_dir)
        command.dest_path.parent.mkdir(parents=True, exist_ok=True)
        command.dest_path.write_text(_codex_markdown(command, root), encoding="utf-8")
        generated_paths.add(command.dest_path.resolve())

    if prune:
        for existing_path in dest_dir.rglob("*.md"):
            if existing_path.resolve() not in generated_paths:
                existing_path.unlink()

    registry_path.write_text(json.dumps(registry, indent=2) + "\n", encoding="utf-8")
    return registry


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=SOURCE_DIR)
    parser.add_argument("--dest", type=Path, default=DEST_DIR)
    parser.add_argument("--registry", type=Path, default=REGISTRY_PATH)
    parser.add_argument("--json", action="store_true", help="Print machine-readable output")
    args = parser.parse_args()

    registry = sync_codex_commands(
        source_dir=args.source,
        dest_dir=args.dest,
        registry_path=args.registry,
        root=ROOT,
    )
    output = {
        "registry": args.registry.relative_to(ROOT).as_posix(),
        "total": registry["total"],
        "source_dir": registry["source_dir"],
        "dest_dir": args.dest.relative_to(ROOT).as_posix(),
    }
    if args.json:
        print(json.dumps(output, indent=2))
    else:
        print(f"Synced {output['total']} commands to {output['registry']}")


if __name__ == "__main__":
    main()
