"""Codex command registry resolver for Mekong slash commands."""

from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
from typing import Any, Optional

import typer
from rich.console import Console
from rich.panel import Panel
from tools.sync_codex_commands import sync_codex_commands

console = Console()
ROOT = Path(__file__).resolve().parents[2]
REGISTRY_PATH = ROOT / ".codex" / "commands" / "registry.json"
SOURCE_DIR = ROOT / ".claude" / "commands"


def _load_registry(path: Path = REGISTRY_PATH) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_text(encoding="utf-8").encode("utf-8")).hexdigest()


def _normalize_command(command_ref: str) -> str:
    return command_ref.strip().lstrip("/")


def _iter_command_files(source_dir: Path) -> list[Path]:
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


def _source_command_ids() -> set[str]:
    return {
        path.relative_to(SOURCE_DIR).with_suffix("").as_posix()
        for path in _iter_command_files(SOURCE_DIR)
    }


def _registry_command_map(registry: dict[str, Any]) -> dict[str, dict[str, Any]]:
    commands = {}
    for item in registry.get("commands", []):
        commands[item["id"]] = item
        for alias in item.get("aliases", []):
            commands[_normalize_command(alias)] = item
    return commands


def _registry_needs_sync(registry: dict[str, Any] | None) -> bool:
    if not registry:
        return True
    source_ids = _source_command_ids()
    commands = {item["id"]: item for item in registry.get("commands", [])}
    if registry.get("total") != len(source_ids) or set(commands) != source_ids:
        return True
    for item in commands.values():
        source_path = ROOT / item["source_path"]
        codex_path = ROOT / item["codex_path"]
        if not source_path.exists() or not codex_path.exists():
            return True
        if _sha256(source_path) != item.get("content_sha256"):
            return True
    return False


def _load_fresh_registry(auto_sync: bool) -> tuple[dict[str, Any], bool]:
    registry = _load_registry() if REGISTRY_PATH.exists() else None
    synced = False
    if auto_sync and _registry_needs_sync(registry):
        registry = sync_codex_commands()
        synced = True
    if registry is None:
        raise FileNotFoundError(str(REGISTRY_PATH))
    return registry, synced


def _resolve_command(command_ref: str, args: list[str], auto_sync: bool = True) -> dict[str, Any]:
    command_id = _normalize_command(command_ref)
    registry, synced = _load_fresh_registry(auto_sync=auto_sync)
    commands = _registry_command_map(registry)
    if command_id not in commands:
        raise KeyError(command_id)

    item = commands[command_id]
    source_path = ROOT / item["source_path"]
    codex_path = ROOT / item["codex_path"]
    argument_text = " ".join(args).strip()
    prompt = codex_path.read_text(encoding="utf-8").replace("$ARGUMENTS", argument_text)
    invocation = item["invocation"].replace("$ARGUMENTS", argument_text).strip()
    source_hash = _sha256(source_path)
    registry_current = not _registry_needs_sync(registry)
    return {
        "id": item["id"],
        "slash": item["slash"],
        "requested": f"/{command_id}",
        "aliases": item.get("aliases", []),
        "description": item["description"],
        "argument_hint": item["argument_hint"],
        "allowed_tools": item["allowed_tools"],
        "source_path": item["source_path"],
        "codex_path": item["codex_path"],
        "invocation": invocation,
        "content_sha256": item["content_sha256"],
        "source_hash_valid": source_hash == item["content_sha256"],
        "registry_synced": registry_current,
        "registry_refreshed": synced,
        "prompt": prompt,
    }


def register_codex_registry_command(app: typer.Typer) -> None:
    """Register Codex command registry helpers onto the Typer app."""

    @app.command(name="codex-command")
    def codex_command(
        command_ref: str = typer.Argument(..., help="Slash command id, e.g. /goals or code/check"),
        args: Optional[list[str]] = typer.Argument(
            None, help="Arguments passed to the command prompt"
        ),
        json_output: bool = typer.Option(False, "--json", "-j", help="Print machine-readable JSON"),
        invocation_only: bool = typer.Option(
            False, "--invocation", help="Print only the Mekong invocation"
        ),
        check: bool = typer.Option(False, "--check", help="Validate source hash before printing"),
        auto_sync: bool = typer.Option(
            True, "--sync/--no-sync", help="Auto-refresh stale Codex registry"
        ),
    ) -> None:
        """Resolve a synced Codex command prompt from `.codex/commands/registry.json`."""
        try:
            output = _resolve_command(command_ref, args or [], auto_sync=auto_sync)
        except KeyError:
            console.print(f"[red]Codex command not found:[/red] {_normalize_command(command_ref)}")
            raise typer.Exit(code=1)
        except FileNotFoundError:
            console.print(
                "[red]Codex command registry not found.[/red] Run python3 tools/sync_codex.py --json"
            )
            raise typer.Exit(code=1)

        if check and not output["source_hash_valid"]:
            console.print(f"[red]Codex command is stale:[/red] {output['id']}")
            raise typer.Exit(code=1)

        if json_output:
            print(json.dumps(output, indent=2))
            return

        if invocation_only:
            print(output["invocation"])
            return

        console.print(
            Panel(
                f"[bold]Command:[/bold] {output['slash']}\n"
                f"[bold]Invocation:[/bold] {output['invocation']}\n"
                f"[bold]Registry:[/bold] .codex/commands/registry.json\n"
                f"[bold]Registry synced:[/bold] {output['registry_synced']}\n"
                f"[bold]Registry refreshed:[/bold] {output['registry_refreshed']}\n"
                f"[bold]Source hash valid:[/bold] {output['source_hash_valid']}",
                title="Codex Command Registry",
                border_style="cyan",
            )
        )
        print(output["prompt"])
