"""CLI commands for Tom Hum AGI daemon management."""
import json
import pathlib
import subprocess

import typer
from rich.console import Console

from src.agents.agi_bridge import AGIBridge

app = typer.Typer(help="Tom Hum AGI daemon management")
console = Console()


@app.command()
def start() -> None:
    """Start the Tom Hum AGI daemon."""
    bridge = AGIBridge()
    if bridge.is_running():
        console.print("[yellow]Daemon already running[/yellow]")
        return
    console.print("[dim]Starting Tom Hum daemon...[/dim]")
    ok = bridge.start()
    if ok:
        console.print("[green]Daemon started successfully[/green]")
    else:
        console.print("[red]Failed to start daemon (task-watcher.js not found or node error)[/red]")
        raise typer.Exit(code=1)


@app.command()
def stop() -> None:
    """Stop the Tom Hum AGI daemon."""
    bridge = AGIBridge()
    if bridge.stop():
        console.print("[green]Daemon stopped[/green]")
    else:
        console.print("[yellow]No daemon process to stop[/yellow]")


@app.command()
def status() -> None:
    """🧠 Show AGI health, score, and 9-subsystem dashboard."""
    from rich.panel import Panel
    from rich.table import Table

    from src.core.agi_score import AGIScoreEngine

    engine = AGIScoreEngine()
    report = engine.calculate()

    # Grade color
    grade_colors = {"S": "bold magenta", "A": "bold green", "B": "cyan", "C": "yellow", "D": "red", "F": "bold red"}
    gc = grade_colors.get(report.grade, "white")

    # Score bar (visual)
    filled = int(report.total_score / 5)
    bar = "█" * filled + "░" * (20 - filled)

    console.print(
        Panel(
            f"[{gc}]Grade: {report.grade}[/{gc}]   "
            f"[bold]Score: {report.total_score}/100[/bold]\n"
            f"[cyan]{bar}[/cyan]\n\n"
            f"[bold]Modules:[/bold]    {report.module_score:.0f}/45  "
            f"[bold]Wiring:[/bold]  {report.wiring_score:.0f}/25  "
            f"[bold]Runtime:[/bold] {report.runtime_score:.0f}/15  "
            f"[bold]Improve:[/bold] {report.improvement_score:.0f}/15",
            title="🧠 AGI v2 Score Dashboard",
            border_style="magenta",
        )
    )

    # Subsystem table
    table = Table(title="9 AGI Subsystems", show_lines=False)
    table.add_column("", width=3)
    table.add_column("Module", style="bold")
    table.add_column("Status")
    table.add_column("Score", justify="right")

    for sub in report.subsystems:
        status_str = "[green]● online[/green]" if sub.available else "[red]○ offline[/red]"
        table.add_row(sub.icon, sub.name, status_str, f"{sub.score:.0f}/5")

    console.print(table)

    # Details
    if report.details:
        details_parts = []
        if "executions" in report.details:
            details_parts.append(f"Executions: {report.details['executions']}")
        if "success_rate" in report.details:
            details_parts.append(f"Success: {report.details['success_rate']:.0f}%")
        if "wired" in report.details:
            details_parts.append(f"Wired: {len(report.details['wired'])}/10")
        if details_parts:
            console.print(f"\n[dim]{' │ '.join(details_parts)}[/dim]")


@app.command()
def metrics() -> None:
    """Show detailed AGI metrics."""
    bridge = AGIBridge()
    data = bridge.metrics()
    if "error" in data:
        console.print(f"[red]{data['error']}[/red]")
        raise typer.Exit(code=1)
    console.print_json(json.dumps(data, indent=2))


@app.command()
def mission(
    content: str = typer.Argument(..., help="Mission content or path to .txt file"),
) -> None:
    """Dispatch a mission to the daemon via tasks/ directory."""
    bridge = AGIBridge()
    p = pathlib.Path(content)
    if p.exists() and p.is_file():
        text = p.read_text(encoding="utf-8")
    else:
        text = content
    filepath = bridge.dispatch(text)
    console.print(f"[green]Mission dispatched:[/green] {filepath}")


@app.command()
def logs(
    lines: int = typer.Option(50, help="Number of log lines to show"),
    follow: bool = typer.Option(False, "--follow", "-f", help="Follow log output"),
) -> None:
    """View Tom Hum daemon logs."""
    bridge = AGIBridge()
    if follow:
        log_path = pathlib.Path.home() / "tom_hum_cto.log"
        if not log_path.exists():
            console.print("[red]Log file not found: ~/tom_hum_cto.log[/red]")
            raise typer.Exit(code=1)
        subprocess.run(["tail", "-f", str(log_path)])
    else:
        output = bridge.logs(lines=lines)
        console.print(output)


@app.command()
def benchmark() -> None:
    """⚡ Run instant AGI benchmark — smoke test all 9 modules and report score."""
    import importlib
    import time

    from rich.table import Table

    modules = [
        ("📡", "NLU", "src.core.nlu", "IntentClassifier"),
        ("💾", "Memory", "src.core.memory", "MemoryStore"),
        ("🪞", "Reflection", "src.core.reflection", "ReflectionEngine"),
        ("🌍", "WorldModel", "src.core.world_model", "WorldModel"),
        ("🔧", "ToolRegistry", "src.core.tool_registry", "ToolRegistry"),
        ("🌐", "BrowserAgent", "src.core.browser_agent", "BrowserAgent"),
        ("🤝", "Collaboration", "src.core.collaboration", "CollaborationProtocol"),
        ("🧬", "CodeEvolution", "src.core.code_evolution", "CodeEvolutionEngine"),
        ("🧠", "VectorMemory", "src.core.vector_memory_store", "VectorMemoryStore"),
    ]

    table = Table(title="⚡ AGI Benchmark", show_lines=False)
    table.add_column("", width=3)
    table.add_column("Module", style="bold")
    table.add_column("Import")
    table.add_column("Init")
    table.add_column("Time", justify="right")

    total_pass = 0
    total_time = 0.0

    for icon, name, mod_path, cls_name in modules:
        t0 = time.time()
        import_ok = False
        init_ok = False
        try:
            m = importlib.import_module(mod_path)
            import_ok = True
            cls = getattr(m, cls_name)
            _instance = cls()
            init_ok = True
        except Exception:
            pass
        elapsed = (time.time() - t0) * 1000
        total_time += elapsed

        imp_str = "[green]✓[/green]" if import_ok else "[red]✗[/red]"
        init_str = "[green]✓[/green]" if init_ok else "[red]✗[/red]"
        if import_ok and init_ok:
            total_pass += 1
        table.add_row(icon, name, imp_str, init_str, f"{elapsed:.0f}ms")

    console.print(table)
    console.print(
        f"\n[bold]Result:[/bold] {total_pass}/9 modules pass | "
        f"Total: {total_time:.0f}ms"
    )

    # Show AGI score
    try:
        from src.core.agi_score import AGIScoreEngine
        report = AGIScoreEngine().calculate()
        grade_colors = {"S": "magenta", "A": "green", "B": "cyan", "C": "yellow"}
        gc = grade_colors.get(report.grade, "white")
        filled = int(report.total_score / 5)
        bar = "█" * filled + "░" * (20 - filled)
        console.print(
            f"[{gc}]🏆 Score: {report.total_score:.0f}/100 ({report.grade})[/{gc}] {bar}"
        )
    except Exception:
        pass

