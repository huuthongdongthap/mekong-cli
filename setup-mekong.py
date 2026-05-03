#!/usr/bin/env python3
"""
Mekong RAAS — Setup Script
Syncs commands from mekong-cli repo to OpenCode database.
Run: python3 ~/mekong-cli/setup-mekong.py
"""

import json
import os
import re
import sqlite3
import sys

REPO_ROOT = os.path.dirname(os.path.abspath(__file__))
COMMANDS_DIR = os.path.join(REPO_ROOT, ".claude", "commands")
DB_PATH = os.path.expanduser("~/.local/share/opencode/opencode.db")

CORE_COMMANDS = [
    {"name": "plan", "description": "Create implementation plan with research and analysis", "agent": "general", "template": "Create an implementation plan for: $ARGUMENTS. Scout the codebase, research approach, create plan in plans/ directory, break into phases. Follow Mekong Protocol.", "hints": ["<task description>"], "source": "command"},
    {"name": "cook", "description": "Recipe executor — run multi-step DAG recipe from recipes/ directory", "agent": "general", "template": "Execute recipe: $ARGUMENTS. Load recipe from recipes/ directory, execute steps via DAG pipeline. Follow Mekong Protocol.", "hints": ["recipe name"], "source": "command"},
    {"name": "worker-exec", "description": "Execute shell command safely with timeout and error handling", "agent": "general", "template": "Execute command: $ARGUMENTS. Run with timeout, capture output, handle errors. Use silent flags. 2 STRIKES & MAX rule.", "hints": ["command to execute"], "source": "command"},
    {"name": "dev-feature", "description": "Feature build — plan, code, test, PR. Full feature cycle in 15 min", "agent": "general", "template": "Build feature: $ARGUMENTS. Plan → Code → Test → PR. Edit chunk (not full rewrite), no UI/CSS unless specified.", "hints": ["feature description"], "source": "command", "subtask": True},
    {"name": "dev-bug-sprint", "description": "Bug sprint — debug, fix, test. Batch bug fixes in 15 min", "agent": "general", "template": "Fix bugs: $ARGUMENTS. Debug root cause → Apply minimal fix → Test → Repeat. 2 STRIKES & MAX per bug.", "hints": ["bug description or issue list"], "source": "command", "subtask": True},
    {"name": "deploy", "description": "Deployment execution — pre-flight checks, deploy, smoke test, rollback plan", "agent": "general", "template": "Deploy to: $ARGUMENTS. Pre-flight checks → Deploy → Smoke test → Rollback plan. Target: Cloudflare Pages.", "hints": ["environment: staging / production"], "source": "command", "subtask": True},
    {"name": "review", "description": "Code review — architecture, security, performance analysis", "agent": "general", "template": "Review: $ARGUMENTS. Architecture check → Security scan → Performance analysis → Improvement suggestions.", "hints": ["PR number or file path"], "source": "command"},
    {"name": "ship", "description": "Ship code to production — test, commit, push, deploy", "agent": "general", "template": "Ship: $ARGUMENTS. Test → Commit → Push → Deploy. Verify before push.", "hints": ["what to ship"], "source": "command", "subtask": True},
    {"name": "test", "description": "Test generation — unit, integration, edge cases, coverage report", "agent": "general", "template": "Generate tests for: $ARGUMENTS. Unit tests → Integration tests → Edge cases → Coverage report.", "hints": ["module or function to test"], "source": "command", "subtask": True},
    {"name": "commands-status", "description": "Show command health — dispatch count, success rate, avg duration", "agent": "general", "template": "Show Mekong command health dashboard from /tmp/factory-metrics.log.", "hints": ["--all | command-name | --top=10"], "source": "command"},
    {"name": "cto-dashboard", "description": "CTO brain health dashboard — ROI scores, active missions", "agent": "general", "template": "Show CTO brain dashboard: ROI scores, active missions, learning state, workforce status.", "hints": ["--roi | --learning | --missions"], "source": "command"},
    {"name": "cto-health", "description": "Run CTO health check dashboard — all subsystems in one view", "agent": "general", "template": "Run comprehensive CTO health check on all subsystems.", "hints": [], "source": "command"},
    {"name": "incident-respond", "description": "Incident response — triage, investigation, mitigation, post-mortem", "agent": "general", "template": "Incident response for: $ARGUMENTS. Triage → Investigation → Mitigation → Post-mortem.", "hints": ["incident description"], "source": "command", "subtask": True},
    {"name": "idea", "description": "Generate full company architecture from business idea (Zero→IPO)", "agent": "general", "template": "Generate company architecture from: $ARGUMENTS. Five-factor → Terrain → Momentum → company.json → Roadmap.", "hints": ["<your business idea>"], "source": "command", "subtask": True},
    {"name": "quick-start", "description": "Start any new project from idea to production in 5 commands", "agent": "general", "template": "Quick start: $ARGUMENTS. /idea → /plan → /cook → /test → /deploy.", "hints": ["project name/idea"], "source": "command"},
    {"name": "context-prime", "description": "Load full project context — architecture, deps, dir structure", "agent": "general", "template": "Load full project context. Read CLAUDE.md, ARCHITECTURE.md, package.json, scan dirs.", "hints": ["--current | project-path"], "source": "command"},
    {"name": "prime", "description": "Quick prime — load essential project context in 5 seconds", "agent": "general", "template": "Quick context load. Read CLAUDE.md + package.json + top-level dirs.", "hints": ["--minimal"], "source": "command"},
]


def extract_frontmatter(filepath: str) -> dict:
    """Extract YAML frontmatter from .md command file."""
    try:
        with open(filepath) as f:
            content = f.read()

        match = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
        if not match:
            return {}

        frontmatter = {}
        for line in match.group(1).split('\n'):
            line = line.strip()
            if ':' in line:
                key, _, value = line.partition(':')
                key = key.strip()
                value = value.strip().strip('"')
                frontmatter[key] = value

        return frontmatter
    except Exception:
        return {}


def generate_all_commands():
    """Generate commands from all .md files in commands directory."""
    commands = []
    if not os.path.isdir(COMMANDS_DIR):
        return commands

    for filename in sorted(os.listdir(COMMANDS_DIR)):
        if not filename.endswith('.md'):
            continue
        filepath = os.path.join(COMMANDS_DIR, filename)
        name = filename[:-3]
        fm = extract_frontmatter(filepath)

        description = fm.get('description', f'Mekong command: {name}')
        hints_str = fm.get('argument-hint', '')
        hints = [h.strip() for h in hints_str.strip('[]').split('|')] if hints_str else []

        # Build template from the command content
        template = f"Execute Mekong command /{name}: $ARGUMENTS. See ~/mekong-cli/.claude/commands/{filename} for full instructions."

        commands.append({
            "name": name,
            "description": description,
            "agent": "general",
            "template": template,
            "hints": hints,
            "source": "command",
        })

    return commands


def update_opencode_db(commands_json: str):
    """Update the opencode database with commands."""
    if not os.path.exists(DB_PATH):
        print(f"❌ Database not found: {DB_PATH}")
        return False

    try:
        conn = sqlite3.connect(DB_PATH)

        # Get all project worktrees
        projects = conn.execute(
            "SELECT worktree FROM project WHERE worktree != '/'"
        ).fetchall()

        for (worktree,) in projects:
            if '/mekong-cli' in worktree:
                conn.execute(
                    "UPDATE project SET commands = ? WHERE worktree = ?",
                    (commands_json, worktree)
                )
                print(f"  ✅ Updated: {worktree}")

        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ DB Error: {e}")
        return False


def main():
    print("🔧 Mekong RAAS Setup")
    print("=" * 50)

    # Generate commands
    print("\n📋 Generating commands from .claude/commands/...")
    all_commands = generate_all_commands()
    print(f"  Found {len(all_commands)} commands in {COMMANDS_DIR}")

    # Also include core commands
    all_command_names = {c['name'] for c in all_commands}
    for core in CORE_COMMANDS:
        if core['name'] in all_command_names:
            # Update existing with core template
            for c in all_commands:
                if c['name'] == core['name']:
                    c['template'] = core['template']
                    break
        else:
            all_commands.append(core)

    commands_json = json.dumps(all_commands)

    # Write to opencode.json for reference
    opencode_json_path = os.path.join(REPO_ROOT, "opencode.json")
    config = {"$schema": "https://opencode.ai/config.json", "command": {}}
    for cmd in all_commands:
        config["command"][cmd["name"]] = {
            "template": cmd["template"],
            "description": cmd["description"],
            "agent": cmd.get("agent", "general"),
        }
        if cmd.get("subtask"):
            config["command"][cmd["name"]]["subtask"] = True

    with open(opencode_json_path, 'w') as f:
        json.dump(config, f, indent=2)
    print(f"  ✅ Wrote opencode.json ({len(all_commands)} commands)")

    # Update opencode database
    print("\n📦 Updating OpenCode database...")
    success = update_opencode_db(commands_json)
    if success:
        print("  ✅ Database updated")
    else:
        print("  ⚠️  DB update failed (open opencode first)")

    print("\n✅ Setup complete!")
    print(f"   {len(all_commands)} Mekong commands available")
    print(f"   Repo: {REPO_ROOT}")
    print(f"   Config: {opencode_json_path}")


if __name__ == "__main__":
    main()
