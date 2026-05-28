"""Goals command: founder goal configuration and Codex auto-mode policy."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path
from typing import Any, Optional

import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from src.core.command_config_store import get_saved_command_config

console = Console()

ROOT = Path(__file__).resolve().parents[2]
GOALS_RECIPE = ROOT / "recipes" / "founder" / "goals.json"
GOALS_COMMAND = ROOT / ".claude" / "commands" / "goals.md"
GOALS_CONTRACT = ROOT / "factory" / "contracts" / "commands" / "goals.json"


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _get_codex_auto_command(cwd: str) -> str:
    script = "source mekong/adapters/registry.sh\nget_launch_cmd codex " + cwd
    result = subprocess.run(
        ["bash", "-lc", script],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout.strip()


def _resolve_mode(
    saved_config: dict[str, Any] | None,
    codex_auto: bool | None,
    auto: bool,
) -> tuple[bool, str]:
    if auto:
        return True, "flag"
    if codex_auto is not None:
        return codex_auto, "flag"
    if saved_config:
        return (
            saved_config.get("mode") == "auto" and saved_config.get("provider") == "codex",
            "saved",
        )
    return False, "default"


def register_goals_command(app: typer.Typer) -> None:
    """Register the goals command onto the typer app."""

    @app.command(name="goals")
    def goals(
        goal: list[str] = typer.Argument(..., help="Goal or command config target"),
        codex_auto: Optional[bool] = typer.Option(
            None,
            "--codex-auto/--no-codex-auto",
            help="Include Codex autonomous execution policy",
        ),
        auto: bool = typer.Option(
            False,
            "--auto",
            help="Alias for --codex-auto",
        ),
        json_output: bool = typer.Option(
            False,
            "--json",
            "-j",
            help="Print machine-readable JSON output",
        ),
    ) -> None:
        """Configure a founder goal into recipe, metrics, and Codex auto policy."""
        goal_text = " ".join(goal).strip()
        recipe = _load_json(GOALS_RECIPE)
        contract = _load_json(GOALS_CONTRACT)
        command_exists = GOALS_COMMAND.exists()
        saved_config = get_saved_command_config("goals")
        codex_enabled, config_source = _resolve_mode(saved_config, codex_auto, auto)
        codex_command = _get_codex_auto_command(str(ROOT)) if codex_enabled else ""

        output = {
            "goal": goal_text,
            "command": "goals",
            "trigger": recipe["trigger"],
            "recipe": str(GOALS_RECIPE.relative_to(ROOT)),
            "contract": str(GOALS_CONTRACT.relative_to(ROOT)),
            "command_file": str(GOALS_COMMAND.relative_to(ROOT)) if command_exists else None,
            "output_dir": recipe["output_dir"],
            "estimated_credits": contract["execution"]["credit_cost"],
            "estimated_minutes": recipe["estimated_minutes"],
            "codex_auto_command": codex_command,
            "config_source": config_source,
            "saved_config": saved_config,
            "dag_groups": [group["id"] for group in recipe["dag"]["groups"]],
            "command_config": {
                "layer": contract["layer"],
                "hub": contract["execution"]["hub"],
                "agents": contract["execution"]["agents"],
                "timeout_ms": contract["execution"]["timeout_ms"],
                "requires_approval": contract["execution"]["requires_approval"],
                "provider": "codex" if codex_enabled else "auto",
                "mode": "auto" if codex_enabled else "plan",
                "approval_policy": "never" if codex_enabled else "on-request",
                "sandbox": "workspace-write" if codex_enabled else "read-only",
            },
        }

        if json_output:
            print(json.dumps(output, indent=2))
            return

        console.print(
            Panel(
                f"[bold]Goal:[/bold] {goal_text}\n"
                f"[bold]Trigger:[/bold] {recipe['trigger']}\n"
                f"[bold]Recipe:[/bold] {output['recipe']}\n"
                f"[bold]Contract:[/bold] {output['contract']}\n"
                f"[bold]Output:[/bold] {recipe['output_dir']}",
                title="Goals Deep Config",
                border_style="cyan",
            )
        )

        table = Table(title="Execution DAG")
        table.add_column("#", justify="right", style="cyan")
        table.add_column("Group", style="bold")
        table.add_column("Mode")
        table.add_column("Depends On", style="dim")
        for index, group in enumerate(recipe["dag"]["groups"], start=1):
            table.add_row(
                str(index),
                group["id"],
                group["mode"],
                ", ".join(group.get("depends_on", [])) or "-",
            )
        console.print(table)

        if codex_command:
            console.print(
                Panel(
                    codex_command,
                    title="Codex Auto Command",
                    border_style="green",
                )
            )
