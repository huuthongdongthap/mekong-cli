"""
Mekong CLI Config Command - Manage environment variables and API keys
"""

import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.prompt import Prompt, Confirm
from pathlib import Path
import os
import json
import subprocess
from dotenv import load_dotenv, set_key

app = typer.Typer(name="config", help="Manage environment variables and API keys")
console = Console()

# Default env file path
ENV_FILE = Path.cwd() / ".env"
REPO_ROOT = Path(__file__).resolve().parents[2]


def _contract_path(command_id: str) -> Path:
    normalized = command_id.strip().lstrip("/").replace("/", "__")
    return REPO_ROOT / "factory" / "contracts" / "commands" / f"{normalized}.json"


def _load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _get_codex_auto_command(cwd: str) -> str:
    script = "source mekong/adapters/registry.sh\nget_launch_cmd codex " + cwd
    result = subprocess.run(
        ["bash", "-lc", script],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout.strip()


def _build_command_output(command_id: str, auto: bool, provider: str) -> dict:
    """Build effective command config from contract, auth, local files, and adapter policy."""
    from src.core.command_authorizer import COMMAND_TIER_MAP

    normalized = command_id.strip().lstrip("/")
    contract_path = _contract_path(normalized)
    if not contract_path.exists():
        raise FileNotFoundError(str(contract_path.relative_to(REPO_ROOT)))

    contract = _load_json(contract_path)
    auth_config = COMMAND_TIER_MAP.get(normalized)
    command_file = REPO_ROOT / ".claude" / "commands" / f"{normalized}.md"
    recipe_file = REPO_ROOT / "recipes" / contract["layer"] / f"{normalized}.json"

    auto_command = ""
    if auto and provider == "codex":
        auto_command = _get_codex_auto_command(str(REPO_ROOT))

    return {
        "command": normalized,
        "contract": str(contract_path.relative_to(REPO_ROOT)),
        "layer": contract["layer"],
        "hub": contract["execution"]["hub"],
        "agents": contract["execution"]["agents"],
        "credit_cost": contract["execution"]["credit_cost"],
        "timeout_ms": contract["execution"]["timeout_ms"],
        "requires_approval": contract["execution"]["requires_approval"],
        "requires_license": auth_config.requires_license if auth_config else None,
        "tier": auth_config.tier.value if auth_config else None,
        "command_file": str(command_file.relative_to(REPO_ROOT)) if command_file.exists() else None,
        "recipe": str(recipe_file.relative_to(REPO_ROOT)) if recipe_file.exists() else None,
        "provider": provider if auto else "auto",
        "mode": "auto" if auto else "plan",
        "approval_policy": "never" if auto and provider == "codex" else "on-request",
        "sandbox": "workspace-write" if auto and provider == "codex" else "read-only",
        "auto_command": auto_command,
    }


def _persistable_command_config(output: dict) -> dict:
    """Strip runtime-only metadata before writing saved command defaults."""
    fields = [
        "command",
        "contract",
        "layer",
        "hub",
        "agents",
        "credit_cost",
        "timeout_ms",
        "requires_approval",
        "requires_license",
        "tier",
        "command_file",
        "recipe",
        "provider",
        "mode",
        "approval_policy",
        "sandbox",
        "auto_command",
    ]
    return {field: output.get(field) for field in fields}


@app.command()
def init() -> None:
    """Initialize .env file with required variables"""
    console.print(
        Panel(
            "🔧 Mekong CLI Configuration Setup",
            border_style="cyan",
        )
    )

    # Create .env if not exists
    if not ENV_FILE.exists():
        ENV_FILE.touch()
        console.print("[green]✓[/green] Created .env file")

    # Required variables
    required_vars = {
        "LLM_BASE_URL": "",
        "LLM_API_KEY": "",
        "LLM_MODEL": "",
    }

    # Load existing env
    load_dotenv(ENV_FILE)

    console.print("\n[bold]Configure required environment variables:[/bold]\n")

    for var_name, default_value in required_vars.items():
        current_value = os.getenv(var_name, "")

        if current_value:
            console.print(f"[dim]{var_name} = {mask_value(current_value)} (already set)[/dim]")
            if Confirm.ask(f"  Update {var_name}?", default=False):
                new_value = Prompt.ask(f"  Enter {var_name}", default=default_value)
                set_key(str(ENV_FILE), var_name, new_value)
                console.print(f"[green]✓[/green] Updated {var_name}")
        else:
            new_value = Prompt.ask(f"  Enter {var_name}", default=default_value)
            set_key(str(ENV_FILE), var_name, new_value)
            console.print(f"[green]✓[/green] Set {var_name}")

    console.print(
        Panel(
            "[green]Configuration initialized![/green]\n\n"
            "Run [bold]mekong status health[/bold] to verify setup",
            border_style="green",
        )
    )


def mask_value(value: str, visible_chars: int = 4) -> str:
    """Mask sensitive value showing only last few chars"""
    if not value:
        return "(empty)"
    if len(value) <= visible_chars:
        return "*" * len(value)
    return "*" * (len(value) - visible_chars) + value[-visible_chars:]


@app.command()
def show() -> None:
    """Show current configuration (masked)"""
    load_dotenv(ENV_FILE)

    console.print(
        Panel(
            "🔐 Current Configuration",
            border_style="blue",
        )
    )

    # Key variables to show
    key_vars = [
        "ANTHROPIC_BASE_URL",
        "ANTHROPIC_MODEL",
        "ANTHROPIC_API_KEY",
        "MEKONG_API_TOKEN",
        "MEKONG_TELEGRAM_TOKEN",
        "OPENAI_API_KEY",
        "GOOGLE_API_KEY",
    ]

    table = Table(title="Environment Variables")
    table.add_column("Variable", style="cyan")
    table.add_column("Value (masked)", style="green")
    table.add_column("Source", style="dim")

    for var_name in key_vars:
        value = os.getenv(var_name, "")
        if value:
            source = "local" if os.getenv(f"LOCAL_{var_name}") else "system"
            table.add_row(var_name, mask_value(value), source)
        else:
            table.add_row(var_name, "[red](not set)[/red]", "-")

    console.print(table)

    # Show env file path
    console.print(f"\n[bold]Env file:[/bold] {ENV_FILE.absolute()}")
    if ENV_FILE.exists():
        console.print("[green]✓ exists[/green]")
    else:
        console.print("[yellow]⚠ does not exist - run 'mekong config init'[/yellow]")


@app.command(name="command")
def command_config(
    command_id: str = typer.Argument(..., help="Command id, e.g. goals or /goals"),
    auto: bool = typer.Option(False, "--auto", help="Include autonomous provider policy"),
    provider: str = typer.Option("codex", "--provider", help="Provider for auto policy"),
    apply: bool = typer.Option(False, "--apply", help="Persist this as the local command default"),
    json_output: bool = typer.Option(False, "--json", "-j", help="Print machine-readable JSON"),
) -> None:
    """Show effective config for a Mekong command contract."""
    from src.core.command_config_store import (
        get_command_config_path,
        get_saved_command_config,
        save_command_config,
    )

    normalized = command_id.strip().lstrip("/")
    try:
        output = _build_command_output(normalized, auto=auto, provider=provider)
    except FileNotFoundError as exc:
        console.print(f"[red]Command contract not found:[/red] {exc}")
        raise typer.Exit(code=1)
    saved = get_saved_command_config(normalized)
    if saved and not apply:
        output["saved_config"] = saved
        validation = _validate_saved_command(normalized, saved)
        drift = _diff_command_config(saved, output)
        output["saved_validation"] = validation
        output["saved_drift"] = {
            "changed": drift["changed"],
            "changes": drift["changes"],
        }

    if normalized == "mekong-cli" and auto:
        apply = True

    if apply:
        saved_payload = _persistable_command_config(output)
        saved_path = save_command_config(normalized, saved_payload)
        output["saved_config"] = saved_payload
        output["saved_config_path"] = str(saved_path)

    if json_output:
        print(json.dumps(output, indent=2))
        return

    console.print(
        Panel(
            f"[bold]Command:[/bold] {normalized}\n"
            f"[bold]Contract:[/bold] {output['contract']}\n"
            f"[bold]Layer:[/bold] {output['layer']}\n"
            f"[bold]Hub:[/bold] {output['hub']}\n"
            f"[bold]Mode:[/bold] {output['mode']}\n"
            f"[bold]Store:[/bold] {get_command_config_path()}",
            title="Mekong Command Config",
            border_style="cyan",
        )
    )

    table = Table(title="Execution")
    table.add_column("Key", style="cyan")
    table.add_column("Value")
    for key in (
        "agents",
        "credit_cost",
        "timeout_ms",
        "requires_approval",
        "requires_license",
        "tier",
        "provider",
        "approval_policy",
        "sandbox",
    ):
        value = json.dumps(output[key]) if isinstance(output[key], list) else str(output[key])
        table.add_row(key, value)
    console.print(table)

    if output["auto_command"]:
        console.print(Panel(output["auto_command"], title="Auto Command", border_style="green"))

    if apply:
        console.print(f"[green]Saved command default:[/green] {output['saved_config_path']}")
    elif saved:
        console.print("[dim]Saved default exists. Use --apply to overwrite.[/dim]")


@app.command(name="commands")
def command_configs(
    json_output: bool = typer.Option(False, "--json", "-j", help="Print machine-readable JSON"),
) -> None:
    """List saved Mekong command defaults."""
    from src.core.command_config_store import get_command_config_path, list_saved_command_configs

    commands = list_saved_command_configs()
    output = {
        "path": str(get_command_config_path()),
        "count": len(commands),
        "commands": commands,
    }

    if json_output:
        print(json.dumps(output, indent=2))
        return

    table = Table(title=f"Saved Command Defaults ({len(commands)})")
    table.add_column("Command", style="cyan")
    table.add_column("Mode")
    table.add_column("Provider")
    table.add_column("Sandbox")
    for command, config in sorted(commands.items()):
        table.add_row(
            command,
            str(config.get("mode", "")),
            str(config.get("provider", "")),
            str(config.get("sandbox", "")),
        )
    console.print(table)
    console.print(f"[dim]Store: {get_command_config_path()}[/dim]")


@app.command(name="command-clear")
def command_config_clear(
    command_id: str = typer.Argument(..., help="Command id, e.g. goals or /goals"),
    json_output: bool = typer.Option(False, "--json", "-j", help="Print machine-readable JSON"),
) -> None:
    """Clear a saved Mekong command default."""
    from src.core.command_config_store import clear_command_config, get_command_config_path

    normalized = command_id.strip().lstrip("/")
    removed = clear_command_config(normalized)
    output = {
        "command": normalized,
        "removed": removed,
        "path": str(get_command_config_path()),
    }

    if json_output:
        print(json.dumps(output, indent=2))
        return

    if removed:
        console.print(f"[green]Cleared command default:[/green] {normalized}")
    else:
        console.print(f"[yellow]No saved command default:[/yellow] {normalized}")


@app.command(name="command-validate")
def command_config_validate(
    command_id: str = typer.Argument(
        None,
        help="Optional command id to validate, e.g. goals or /goals",
    ),
    json_output: bool = typer.Option(False, "--json", "-j", help="Print machine-readable JSON"),
) -> None:
    """Validate saved Mekong command defaults against contracts and local files."""
    from src.core.command_config_store import get_command_config_path, list_saved_command_configs

    saved_configs = list_saved_command_configs()
    if command_id:
        normalized = command_id.strip().lstrip("/")
        saved_configs = (
            {
                normalized: saved_configs[normalized],
            }
            if normalized in saved_configs
            else {}
        )

    results = []
    for command, saved in sorted(saved_configs.items()):
        errors = []
        warnings = []

        contract = saved.get("contract")
        if not contract or not (REPO_ROOT / contract).exists():
            errors.append("missing contract")

        recipe = saved.get("recipe")
        if recipe and not (REPO_ROOT / recipe).exists():
            errors.append("missing recipe")

        command_file = saved.get("command_file")
        if command_file and not (REPO_ROOT / command_file).exists():
            errors.append("missing command file")

        if saved.get("mode") == "auto":
            if saved.get("provider") != "codex":
                warnings.append("auto mode is currently only deeply verified for codex")
            if saved.get("provider") == "codex":
                if saved.get("approval_policy") != "never":
                    errors.append("codex auto requires approval_policy=never")
                if saved.get("sandbox") != "workspace-write":
                    errors.append("codex auto requires sandbox=workspace-write")
                auto_command = saved.get("auto_command", "")
                if "codex --ask-for-approval never --sandbox workspace-write" not in auto_command:
                    errors.append("codex auto command does not match adapter policy")

        results.append(
            {
                "command": command,
                "valid": not errors,
                "errors": errors,
                "warnings": warnings,
            }
        )

    output = {
        "path": str(get_command_config_path()),
        "count": len(results),
        "valid": all(result["valid"] for result in results),
        "results": results,
    }

    if json_output:
        print(json.dumps(output, indent=2))
    else:
        table = Table(title="Command Config Validation")
        table.add_column("Command", style="cyan")
        table.add_column("Valid")
        table.add_column("Errors")
        table.add_column("Warnings")
        for result in results:
            table.add_row(
                result["command"],
                "yes" if result["valid"] else "no",
                ", ".join(result["errors"]) or "-",
                ", ".join(result["warnings"]) or "-",
            )
        console.print(table)
        console.print(f"[dim]Store: {get_command_config_path()}[/dim]")

    if not output["valid"]:
        raise typer.Exit(code=1)


def _validate_saved_command(command: str, saved: dict) -> dict:
    errors = []
    warnings = []

    contract = saved.get("contract")
    if not contract or not (REPO_ROOT / contract).exists():
        errors.append("missing contract")

    recipe = saved.get("recipe")
    if recipe and not (REPO_ROOT / recipe).exists():
        errors.append("missing recipe")

    command_file = saved.get("command_file")
    if command_file and not (REPO_ROOT / command_file).exists():
        errors.append("missing command file")

    if saved.get("mode") == "auto":
        if saved.get("provider") != "codex":
            warnings.append("auto mode is currently only deeply verified for codex")
        if saved.get("provider") == "codex":
            if saved.get("approval_policy") != "never":
                errors.append("codex auto requires approval_policy=never")
            if saved.get("sandbox") != "workspace-write":
                errors.append("codex auto requires sandbox=workspace-write")
            auto_command = saved.get("auto_command", "")
            if "codex --ask-for-approval never --sandbox workspace-write" not in auto_command:
                errors.append("codex auto command does not match adapter policy")

    return {
        "command": command,
        "valid": not errors,
        "errors": errors,
        "warnings": warnings,
    }


def _diff_command_config(saved: dict, effective: dict) -> dict:
    """Return field-level differences between saved and effective command config."""
    fields = [
        "contract",
        "layer",
        "hub",
        "agents",
        "credit_cost",
        "timeout_ms",
        "requires_approval",
        "requires_license",
        "tier",
        "command_file",
        "recipe",
        "provider",
        "mode",
        "approval_policy",
        "sandbox",
        "auto_command",
    ]
    changes = []
    for field in fields:
        if saved.get(field) != effective.get(field):
            changes.append(
                {
                    "field": field,
                    "saved": saved.get(field),
                    "effective": effective.get(field),
                }
            )
    return {
        "changed": bool(changes),
        "changes": changes,
    }


@app.command(name="command-repair")
def command_config_repair(
    command_id: str = typer.Argument(..., help="Command id, e.g. goals or /goals"),
    provider: str = typer.Option("codex", "--provider", help="Provider for repaired auto policy"),
    auto: bool = typer.Option(True, "--auto/--plan", help="Repair as auto or plan mode"),
    json_output: bool = typer.Option(False, "--json", "-j", help="Print machine-readable JSON"),
) -> None:
    """Repair a saved Mekong command default from contract and adapter policy."""
    from src.core.command_config_store import save_command_config

    normalized = command_id.strip().lstrip("/")
    try:
        repaired = _build_command_output(normalized, auto=auto, provider=provider)
    except FileNotFoundError as exc:
        console.print(f"[red]Command contract not found:[/red] {exc}")
        raise typer.Exit(code=1)

    saved_path = save_command_config(normalized, repaired)
    output = {
        "command": normalized,
        "repaired": True,
        "path": str(saved_path),
        "config": repaired,
    }

    if json_output:
        print(json.dumps(output, indent=2))
        return

    console.print(f"[green]Repaired command default:[/green] {normalized}")
    console.print(f"[dim]Store: {saved_path}[/dim]")


@app.command(name="command-diff")
def command_config_diff(
    command_id: str = typer.Argument(..., help="Command id, e.g. goals or /goals"),
    provider: str = typer.Option("codex", "--provider", help="Provider for effective auto policy"),
    auto: bool = typer.Option(True, "--auto/--plan", help="Compare against auto or plan mode"),
    json_output: bool = typer.Option(False, "--json", "-j", help="Print machine-readable JSON"),
) -> None:
    """Compare saved command default with current effective config."""
    from src.core.command_config_store import get_saved_command_config

    normalized = command_id.strip().lstrip("/")
    saved = get_saved_command_config(normalized)
    if not saved:
        output = {
            "command": normalized,
            "saved": False,
            "changed": False,
            "changes": [],
        }
        if json_output:
            print(json.dumps(output, indent=2))
            return
        console.print(f"[yellow]No saved command default:[/yellow] {normalized}")
        return

    try:
        effective = _build_command_output(normalized, auto=auto, provider=provider)
    except FileNotFoundError as exc:
        console.print(f"[red]Command contract not found:[/red] {exc}")
        raise typer.Exit(code=1)

    diff = _diff_command_config(saved, effective)
    output = {
        "command": normalized,
        "saved": True,
        "changed": diff["changed"],
        "changes": diff["changes"],
    }

    if json_output:
        print(json.dumps(output, indent=2))
        return

    table = Table(title=f"Command Config Diff: {normalized}")
    table.add_column("Field", style="cyan")
    table.add_column("Saved")
    table.add_column("Effective")
    for change in diff["changes"]:
        table.add_row(
            change["field"],
            json.dumps(change["saved"]),
            json.dumps(change["effective"]),
        )
    console.print(table)
    if not diff["changed"]:
        console.print("[green]Saved default matches effective config.[/green]")


@app.command(name="commands-sync")
def command_configs_sync(
    dry_run: bool = typer.Option(False, "--dry-run", help="Report repairs without writing"),
    json_output: bool = typer.Option(False, "--json", "-j", help="Print machine-readable JSON"),
) -> None:
    """Repair invalid saved Mekong command defaults in one pass."""
    from src.core.command_config_store import list_saved_command_configs, save_command_config

    saved_configs = list_saved_command_configs()
    repaired = []
    valid = []
    failed = []

    for command, saved in sorted(saved_configs.items()):
        validation = _validate_saved_command(command, saved)
        if validation["valid"]:
            valid.append(command)
            continue

        auto = saved.get("mode") == "auto"
        provider = saved.get("provider", "codex")
        try:
            repaired_config = _build_command_output(command, auto=auto, provider=provider)
        except FileNotFoundError as exc:
            failed.append(
                {
                    "command": command,
                    "error": str(exc),
                    "validation": validation,
                }
            )
            continue

        if not dry_run:
            save_command_config(command, repaired_config)
        repaired.append(
            {
                "command": command,
                "dry_run": dry_run,
                "before_errors": validation["errors"],
                "config": repaired_config,
            }
        )

    output = {
        "checked": len(saved_configs),
        "valid": valid,
        "repaired": repaired,
        "failed": failed,
        "dry_run": dry_run,
    }

    if json_output:
        print(json.dumps(output, indent=2))
        return

    console.print(
        Panel(
            f"[bold]Checked:[/bold] {output['checked']}\n"
            f"[bold]Valid:[/bold] {len(valid)}\n"
            f"[bold]Repaired:[/bold] {len(repaired)}\n"
            f"[bold]Failed:[/bold] {len(failed)}",
            title="Command Config Sync",
            border_style="cyan",
        )
    )


@app.command(name="commands-export")
def command_configs_export(
    output: str = typer.Option(..., "--output", "-o", help="Export file path"),
    json_output: bool = typer.Option(False, "--json", "-j", help="Print machine-readable JSON"),
) -> None:
    """Export saved Mekong command defaults to a JSON file."""
    from src.core.command_config_store import load_command_config

    output_path = Path(output)
    data = load_command_config()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")

    result = {
        "output": str(output_path),
        "count": len(data.get("commands", {})),
    }
    if json_output:
        print(json.dumps(result, indent=2))
        return
    console.print(f"[green]Exported command defaults:[/green] {output_path}")


@app.command(name="commands-import")
def command_configs_import(
    input: str = typer.Option(..., "--input", "-i", help="Import file path"),
    merge: bool = typer.Option(True, "--merge/--replace", help="Merge into existing defaults"),
    json_output: bool = typer.Option(False, "--json", "-j", help="Print machine-readable JSON"),
) -> None:
    """Import saved Mekong command defaults from a JSON file."""
    from src.core.command_config_store import get_command_config_path, load_command_config

    input_path = Path(input)
    try:
        incoming = json.loads(input_path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError) as exc:
        console.print(f"[red]Invalid import file:[/red] {exc}")
        raise typer.Exit(code=1)

    incoming_commands = incoming.get("commands", {})
    if not isinstance(incoming_commands, dict):
        console.print("[red]Invalid import file:[/red] missing commands object")
        raise typer.Exit(code=1)

    data = load_command_config() if merge else {"version": "1.0.0", "commands": {}}
    data["commands"].update(incoming_commands)

    config_path = get_command_config_path()
    config_path.parent.mkdir(parents=True, exist_ok=True)
    config_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")

    result = {
        "input": str(input_path),
        "path": str(config_path),
        "imported": len(incoming_commands),
        "total": len(data["commands"]),
        "merge": merge,
    }
    if json_output:
        print(json.dumps(result, indent=2))
        return
    console.print(f"[green]Imported command defaults:[/green] {len(incoming_commands)}")


@app.command()
def get(key: str) -> None:
    """Get a specific config value"""
    load_dotenv(ENV_FILE)

    value = os.getenv(key, "")
    if not value:
        console.print(f"[yellow]'{key}' is not set[/yellow]")
    else:
        # Check if it looks like a secret
        is_secret = "key" in key.lower() or "token" in key.lower() or "secret" in key.lower()

        if is_secret:
            console.print(f"[bold]{key}:[/bold] {mask_value(value)}")
            if Confirm.ask("Show full value?", default=False):
                console.print(f"[dim]{value}[/dim]")
        else:
            console.print(f"[bold]{key}:[/bold] {value}")


@app.command()
def set(key: str, value: str) -> None:
    """Set a config value"""
    if not ENV_FILE.exists():
        ENV_FILE.touch()
        console.print(f"[green]✓[/green] Created {ENV_FILE}")

    set_key(str(ENV_FILE), key, value)
    console.print(
        f"[green]✓[/green] Set {key} = {mask_value(value) if 'key' in key.lower() or 'token' in key.lower() else value}"
    )


@app.command()
def unset(key: str) -> None:
    """Remove a config value"""
    from dotenv import dotenv_values

    if not ENV_FILE.exists():
        console.print("[yellow].env file does not exist[/yellow]")
        return

    # Read all vars
    env_vars = dotenv_values(str(ENV_FILE))

    if key not in env_vars:
        console.print(f"[yellow]'{key}' not found in .env[/yellow]")
        return

    # Remove and rewrite
    del env_vars[key]

    # Clear file
    ENV_FILE.write_text("")

    # Rewrite without the key
    for k, v in env_vars.items():
        set_key(str(ENV_FILE), k, v or "")

    console.print(f"[green]✓[/green] Unset {key}")


@app.command()
def validate() -> None:
    """Validate configuration and check for issues"""
    from src.core.command_config_store import list_saved_command_configs

    load_dotenv(ENV_FILE)

    console.print(
        Panel(
            "🔍 Configuration Validation",
            border_style="yellow",
        )
    )

    issues = []
    warnings = []

    # Required vars
    required = ["ANTHROPIC_BASE_URL", "ANTHROPIC_MODEL"]
    for var in required:
        if not os.getenv(var):
            issues.append(f"Missing required: {var}")

    # Optional but recommended
    recommended = ["MEKONG_API_TOKEN"]
    for var in recommended:
        if not os.getenv(var):
            warnings.append(f"Recommended but not set: {var}")

    # URL format validation
    base_url = os.getenv("ANTHROPIC_BASE_URL", "")
    if base_url and not base_url.startswith(("http://", "https://")):
        issues.append("ANTHROPIC_BASE_URL must start with http:// or https://")

    # Model name validation
    model = os.getenv("ANTHROPIC_MODEL", "")
    if model and " " in model:
        warnings.append("Model name contains spaces - this may cause issues")

    saved_command_configs = list_saved_command_configs()
    for command, saved in sorted(saved_command_configs.items()):
        result = _validate_saved_command(command, saved)
        for error in result["errors"]:
            issues.append(f"Command config {command}: {error}")
        for warning in result["warnings"]:
            warnings.append(f"Command config {command}: {warning}")

    # Report
    if not issues and not warnings:
        console.print("[bold green]✅ Configuration is valid![/bold green]")
        return

    if issues:
        console.print(f"[bold red]❌ {len(issues)} critical issue(s):[/bold red]")
        for issue in issues:
            console.print(f"  • {issue}")

    if warnings:
        console.print(f"\n[yellow]⚠️  {len(warnings)} warning(s):[/yellow]")
        for warning in warnings:
            console.print(f"  • {warning}")

    if issues:
        raise typer.Exit(1)


@app.command()
def export(output: str = typer.Option(None, "--output", "-o", help="Output file path")) -> None:
    """Export configuration to file (excluding secrets)"""
    load_dotenv(ENV_FILE)

    # Non-secret vars to export
    public_vars = [
        "ANTHROPIC_BASE_URL",
        "ANTHROPIC_MODEL",
        "MEKONG_DEBUG",
        "MEKONG_LOG_LEVEL",
    ]

    lines = ["# Mekong CLI Configuration Export", f"# Generated: {Path.cwd()}", ""]

    for var in public_vars:
        value = os.getenv(var, "")
        if value:
            lines.append(f"{var}={value}")

    content = "\n".join(lines)

    if output:
        output_path = Path(output)
        output_path.write_text(content)
        console.print(f"[green]✓[/green] Exported to {output}")
    else:
        console.print("[bold]Configuration Export:[/bold]")
        console.print(content)


def main():
    """Entry point for config subcommands"""
    app()


if __name__ == "__main__":
    app()
