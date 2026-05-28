#!/usr/bin/env python3
"""
🏯 Zero-Touch Morning Pipeline
==============================
Complete morning automation - runs everything with one command.

Usage: python3 scripts/morning.py
"""

import subprocess
from datetime import datetime


def run(cmd, silent=False, use_shell=False):
    """Run command safely - only use shell when absolutely necessary."""
    if use_shell:
        # Only use shell for complex commands with pipes that can't be converted
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    else:
        # Safe: Split command into arguments if it's a simple command
        if isinstance(cmd, str):
            cmd_parts = cmd.split()
            result = subprocess.run(cmd_parts, capture_output=True, text=True)
        else:
            result = subprocess.run(cmd, capture_output=True, text=True)

    if not silent:
        print(result.stdout)
    return result.returncode == 0


def run_safe_pytest_with_tail(silent=False):
    """Run pytest and get last 5 lines safely."""
    try:
        result = subprocess.run(
            ["python3", "-m", "pytest", "tests/test_wow.py", "-v", "--tb=short"],
            capture_output=True,
            text=True,
        )

        # Get last 5 lines using Python instead of shell tail
        lines = result.stdout.strip().split("\n")
        tail_output = "\n".join(lines[-5:]) if lines else ""

        if not silent:
            print(tail_output)

        return result.returncode == 0
    except Exception as e:
        print(f"Error running pytest: {e}")
        return False


def main():
    print("\n" + "=" * 60)
    print("🏯 ZERO-TOUCH MORNING PIPELINE")
    print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 60)

    steps = [
        ("1️⃣  Git Pull", ["git", "pull", "origin", "main"], False),
        ("2️⃣  Run Tests", None, False),  # Will use run_safe_pytest_with_tail
        ("3️⃣  Product Stats", ["python3", "scripts/product_stats.py"], False),
        ("4️⃣  Generate Tweet", ["python3", "scripts/git_to_tweet.py"], False),
        ("5️⃣  Revenue Check", ["python3", "scripts/revenue_tracker.py"], False),
    ]

    for name, cmd, use_shell in steps:
        print(f"\n{name}")
        print("-" * 40)
        if name == "2️⃣  Run Tests":
            run_safe_pytest_with_tail()
        else:
            run(cmd, use_shell=use_shell)

    print("\n" + "=" * 60)
    print("✅ MORNING PIPELINE COMPLETE")
    print("=" * 60)
    print("""
🔴 YOUR ACTIONS:
1. Review: marketing/drafts/tweet_20260117.md
2. Post Twitter thread (copy-paste)
3. Publish products to Gumroad (manual)
4. Add revenue: python3 scripts/revenue_tracker.py add 47 gumroad

🏯 Bất chiến nhi thắng
""")


if __name__ == "__main__":
    main()
