"""Persistent command configuration for Mekong CLI."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any


def get_config_dir() -> Path:
    """Return the config directory used for persistent Mekong settings."""
    return Path(os.getenv("MEKONG_CONFIG_DIR", ".mekong"))


def get_command_config_path() -> Path:
    """Return the command defaults config path."""
    return get_config_dir() / "command-config.json"


def load_command_config(path: Path | None = None) -> dict[str, Any]:
    """Load persisted command config, returning an empty structure if missing."""
    config_path = path or get_command_config_path()
    if not config_path.exists():
        return {"version": "1.0.0", "commands": {}}

    try:
        data = json.loads(config_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {"version": "1.0.0", "commands": {}}

    if not isinstance(data, dict):
        return {"version": "1.0.0", "commands": {}}
    data.setdefault("version", "1.0.0")
    data.setdefault("commands", {})
    return data


def save_command_config(command: str, config: dict[str, Any], path: Path | None = None) -> Path:
    """Persist config for one command and return the written file path."""
    config_path = path or get_command_config_path()
    data = load_command_config(config_path)
    data["commands"][command] = config
    config_path.parent.mkdir(parents=True, exist_ok=True)
    config_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    return config_path


def get_saved_command_config(command: str, path: Path | None = None) -> dict[str, Any] | None:
    """Return saved config for a command, if any."""
    data = load_command_config(path)
    saved = data.get("commands", {}).get(command)
    return saved if isinstance(saved, dict) else None


def list_saved_command_configs(path: Path | None = None) -> dict[str, dict[str, Any]]:
    """Return all saved command configs."""
    data = load_command_config(path)
    commands = data.get("commands", {})
    if not isinstance(commands, dict):
        return {}
    return {k: v for k, v in commands.items() if isinstance(v, dict)}


def clear_command_config(command: str, path: Path | None = None) -> bool:
    """Remove one saved command config. Return True if something was removed."""
    config_path = path or get_command_config_path()
    data = load_command_config(config_path)
    commands = data.setdefault("commands", {})
    if command not in commands:
        return False
    del commands[command]
    config_path.parent.mkdir(parents=True, exist_ok=True)
    config_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    return True
