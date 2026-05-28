#!/usr/bin/env python3
"""
sync_antigravity.py — Sync ALL Claude commands → Gemini CLI TOML format.

Scans .claude/commands/ (flat + nested) and generates .gemini/commands/<name>.toml
for every command not yet present.

Usage:
    python3 tools/sync_antigravity.py [--force]
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CLAUDE_DIR = ROOT / ".claude" / "commands"
GEMINI_DIR = ROOT / ".gemini" / "commands"

FORCE = "--force" in sys.argv


def extract_description(md_path: Path) -> str:
    """Extract description from a Claude command .md file."""
    content = md_path.read_text(encoding="utf-8", errors="replace")

    # Try YAML frontmatter first
    fm_match = re.match(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
    if fm_match:
        for line in fm_match.group(1).splitlines():
            if line.strip().startswith("description:"):
                desc = line.split(":", 1)[1].strip().strip('"').strip("'")
                if desc:
                    return desc

    # Try first heading
    heading_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    if heading_match:
        heading = heading_match.group(1).strip()
        # Clean up heading
        heading = re.sub(r"^/\S+\s*[—–-]\s*", "", heading)
        if heading:
            return heading[:120]

    # Fallback: first non-empty, non-heading line
    for line in content.splitlines():
        stripped = line.strip()
        if stripped and not stripped.startswith("#") and not stripped.startswith("---"):
            return stripped[:120]

    return f"Mekong command: {md_path.stem}"


def command_name_from_path(md_path: Path) -> str:
    """Generate a flat command name from a possibly nested path."""
    rel = md_path.relative_to(CLAUDE_DIR)
    parts = list(rel.parts)
    # Remove .md extension from last part
    parts[-1] = parts[-1].replace(".md", "")
    return "-".join(parts)


MEKONG_BIN = "/Users/mac/.local/bin/mekong"


def generate_toml(name: str, description: str) -> str:
    """Generate TOML content for a Gemini command."""
    # Escape quotes in description
    desc = description.replace('"', '\\"')
    return f'description = "{desc}"\n[steps]\n[steps.run]\ncommand = "{MEKONG_BIN} {name} {{{{args}}}}"\n'


def main():
    GEMINI_DIR.mkdir(parents=True, exist_ok=True)

    # Collect all .md files from Claude commands
    all_md_files = sorted(CLAUDE_DIR.rglob("*.md"))

    existing_tomls = {p.stem for p in GEMINI_DIR.glob("*.toml")}
    created = 0
    skipped = 0
    updated = 0

    for md_path in all_md_files:
        name = command_name_from_path(md_path)
        toml_path = GEMINI_DIR / f"{name}.toml"

        if toml_path.stem in existing_tomls and not FORCE:
            skipped += 1
            continue

        description = extract_description(md_path)
        toml_content = generate_toml(name, description)

        if FORCE and toml_path.exists():
            toml_path.write_text(toml_content, encoding="utf-8")
            updated += 1
        else:
            toml_path.write_text(toml_content, encoding="utf-8")
            created += 1

    print("✅ Sync complete!")
    print(f"   📄 Claude commands scanned: {len(all_md_files)}")
    print(f"   ✨ New TOML files created:  {created}")
    print(f"   🔄 Updated (--force):       {updated}")
    print(f"   ⏭️  Skipped (already exist): {skipped}")
    print(f"   📁 Gemini commands total:   {len(list(GEMINI_DIR.glob('*.toml')))}")


if __name__ == "__main__":
    main()
