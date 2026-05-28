"""Mekong CLI command: inspect saved root command configuration."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import typer
from rich.console import Console
from rich.panel import Panel

from src.core.command_config_store import get_saved_command_config, save_command_config

console = Console()

ROOT = Path(__file__).resolve().parents[2]
CONTRACT = ROOT / "factory" / "contracts" / "commands" / "mekong-cli.json"
COMMAND_FILE = ROOT / ".claude" / "commands" / "mekong-cli.md"
RECIPE = ROOT / "recipes" / "ops" / "mekong-cli.json"


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _get_codex_auto_command() -> str:
    return f"cd {ROOT} && codex --ask-for-approval never --sandbox workspace-write"


def _build_saved_auto_config() -> dict[str, Any]:
    contract = _load_json(CONTRACT)
    return {
        "command": "mekong-cli",
        "contract": str(CONTRACT.relative_to(ROOT)),
        "layer": contract["layer"],
        "hub": contract["execution"]["hub"],
        "agents": contract["execution"]["agents"],
        "credit_cost": contract["execution"]["credit_cost"],
        "timeout_ms": contract["execution"]["timeout_ms"],
        "requires_approval": contract["execution"]["requires_approval"],
        "requires_license": False,
        "tier": "free",
        "command_file": str(COMMAND_FILE.relative_to(ROOT)) if COMMAND_FILE.exists() else None,
        "recipe": str(RECIPE.relative_to(ROOT)) if RECIPE.exists() else None,
        "provider": "codex",
        "mode": "auto",
        "approval_policy": "never",
        "sandbox": "workspace-write",
        "auto_command": _get_codex_auto_command(),
    }


def register_mekong_cli_command(app: typer.Typer) -> None:
    """Register the mekong-cli command onto the typer app."""

    @app.command(name="mekong-cli")
    def mekong_cli(
        auto: bool = typer.Option(
            False,
            "--auto",
            help="Persist and use Codex auto mode for mekong-cli",
        ),
        json_output: bool = typer.Option(
            False,
            "--json",
            "-j",
            help="Print machine-readable JSON output",
        ),
    ) -> None:
        """Show Mekong CLI root command configuration."""
        contract = _load_json(CONTRACT)
        if auto:
            save_command_config("mekong-cli", _build_saved_auto_config())
        saved = get_saved_command_config("mekong-cli")
        output = {
            "command": "mekong-cli",
            "contract": str(CONTRACT.relative_to(ROOT)),
            "command_file": str(COMMAND_FILE.relative_to(ROOT)) if COMMAND_FILE.exists() else None,
            "recipe": str(RECIPE.relative_to(ROOT)) if RECIPE.exists() else None,
            "layer": contract["layer"],
            "hub": contract["execution"]["hub"],
            "agents": contract["execution"]["agents"],
            "saved_config": saved,
            "config_source": "saved" if saved else "default",
            "command_config": {
                "provider": saved.get("provider", "auto") if saved else "auto",
                "mode": saved.get("mode", "plan") if saved else "plan",
                "approval_policy": (
                    saved.get("approval_policy", "on-request") if saved else "on-request"
                ),
                "sandbox": saved.get("sandbox", "read-only") if saved else "read-only",
                "auto_command": saved.get("auto_command", "") if saved else "",
            },
        }

        if json_output:
            print(json.dumps(output, indent=2))
            return

        console.print(
            Panel(
                f"[bold]Command:[/bold] mekong-cli\n"
                f"[bold]Contract:[/bold] {output['contract']}\n"
                f"[bold]Source:[/bold] {output['config_source']}\n"
                f"[bold]Mode:[/bold] {output['command_config']['mode']}\n"
                f"[bold]Provider:[/bold] {output['command_config']['provider']}",
                title="Mekong CLI Config",
                border_style="cyan",
            )
        )
