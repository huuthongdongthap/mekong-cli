"""
Mekong CLI - Main Entry Point

RaaS Agency Operating System CLI.
Thin entry point only — all command logic lives in src/cli/.
App wiring happens in src/cli/app_setup.py.
"""

import os
import sys

# Allow running as script: python3 src/main.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import typer
from rich.console import Console
from rich.panel import Panel
from rich.text import Text

from src.cli.app_setup import build_app
from src.cli.codex_registry_command import _normalize_command, _resolve_command

console = Console()

# Fully wired app instance (sub-apps + all command groups)
app = build_app()

REGISTERED_COMMANDS = {
    "agi",
    "ask",
    "autonomous",
    "binh-phap",
    "bmad",
    "browse",
    "code",
    "codex-command",
    "collab",
    "config",
    "cook",
    "dash",
    "debug",
    "deploy",
    "design",
    "eval-agent",
    "evolve",
    "evolve-code",
    "gateway",
    "goals",
    "halt",
    "init",
    "list",
    "mekong-cli",
    "memory",
    "metrics",
    "plan",
    "run",
    "schedule",
    "search",
    "spec",
    "swarm",
    "telegram",
    "tools",
    "ui",
    "version",
}


@app.callback(invoke_without_command=True)
def main(ctx: typer.Context) -> None:
    """Mekong CLI: RaaS Agency Operating System"""
    if ctx.invoked_subcommand is None:
        console.print(
            Panel(
                Text("Mekong CLI: RaaS Agency Operating System", style="bold green"),
                title="🚀 Genesis",
                border_style="green",
            )
        )
        console.print(
            "\n[dim]Use[/dim] [bold cyan]mekong --help[/bold cyan] [dim]to see available commands[/dim]"
        )


def _maybe_dispatch_registry_command(argv: list[str]) -> bool:
    """Resolve registry-backed slash commands before Typer rejects unknown commands."""
    if not argv:
        return False
    command_ref = argv[0]
    if command_ref.startswith("-") or _normalize_command(command_ref) in REGISTERED_COMMANDS:
        return False

    args = []
    json_output = False
    invocation_only = False
    check = False
    auto_sync = True
    for item in argv[1:]:
        if item in {"--json", "-j"}:
            json_output = True
        elif item == "--invocation":
            invocation_only = True
        elif item == "--check":
            check = True
        elif item == "--no-sync":
            auto_sync = False
        elif item == "--sync":
            auto_sync = True
        else:
            args.append(item)

    try:
        output = _resolve_command(command_ref, args, auto_sync=auto_sync)
    except KeyError:
        return False

    if check and not output["source_hash_valid"]:
        console.print(f"[red]Codex command is stale:[/red] {output['id']}")
        raise typer.Exit(code=1)
    if json_output:
        import json

        print(json.dumps(output, indent=2))
    elif invocation_only:
        print(output["invocation"])
    else:
        print(output["prompt"])
    return True


def entrypoint() -> None:
    """Console-script entrypoint with registry fallback dispatch."""
    if not _maybe_dispatch_registry_command(sys.argv[1:]):
        if len(sys.argv) > 1 and sys.argv[1].startswith("/"):
            normalized = _normalize_command(sys.argv[1])
            if normalized in REGISTERED_COMMANDS:
                sys.argv[1] = normalized
        app()


if __name__ == "__main__":
    entrypoint()
