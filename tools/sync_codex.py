#!/usr/bin/env python3
"""Sync Mekong CLI commands and architecture into Codex-native artifacts."""

from __future__ import annotations

import argparse
import json

from sync_codex_architecture import sync_codex_architecture
from sync_codex_commands import sync_codex_commands


def sync_codex() -> dict:
    commands = sync_codex_commands()
    architecture = sync_codex_architecture()
    return {
        "commands": {
            "registry": ".codex/commands/registry.json",
            "total": commands["total"],
        },
        "architecture": {
            "registry": ".codex/architecture/registry.json",
            "source_docs": len(architecture["source_docs"]),
            "counts": architecture["counts"],
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true", help="Print machine-readable output")
    args = parser.parse_args()

    output = sync_codex()
    if args.json:
        print(json.dumps(output, indent=2))
    else:
        print(
            "Synced "
            f"{output['commands']['total']} commands and "
            f"{output['architecture']['source_docs']} architecture sources into Codex"
        )


if __name__ == "__main__":
    main()
