#!/usr/bin/env python3
"""
💰 Revenue Tracker
==================
Tracks revenue across all platforms for Agentic Overlord dashboard.

Usage: python3 scripts/revenue_tracker.py
"""

import json
from datetime import datetime
from pathlib import Path

# Revenue log file
REVENUE_FILE = Path(".mekong/revenue.json")


def load_revenue():
    """Load revenue data."""
    if REVENUE_FILE.exists():
        return json.loads(REVENUE_FILE.read_text())
    return {
        "last_updated": None,
        "total": 0,
        "platforms": {"gumroad": 0, "polar": 0, "consulting": 0},
        "history": [],
    }


def save_revenue(data):
    """Save revenue data."""
    REVENUE_FILE.parent.mkdir(parents=True, exist_ok=True)
    REVENUE_FILE.write_text(json.dumps(data, indent=2))


def add_revenue(amount, platform, note=""):
    """Add revenue entry."""
    data = load_revenue()
    data["total"] += amount
    data["platforms"][platform] = data["platforms"].get(platform, 0) + amount
    data["history"].append(
        {
            "date": datetime.now().isoformat(),
            "amount": amount,
            "platform": platform,
            "note": note,
        }
    )
    data["last_updated"] = datetime.now().isoformat()
    save_revenue(data)
    print(f"✅ Added ${amount} from {platform}")
    return data


def show_dashboard():
    """Show revenue dashboard."""
    data = load_revenue()

    print("\n" + "=" * 50)
    print("💰 REVENUE DASHBOARD")
    print("=" * 50)
    print(f"\n📊 Total: ${data['total']:.2f}")
    print(f"⏰ Last updated: {data.get('last_updated', 'Never')}\n")

    print("📈 By Platform:")
    for platform, amount in data.get("platforms", {}).items():
        bar = "█" * int(amount / 10) if amount > 0 else "░"
        print(f"  {platform.capitalize():<12} ${amount:>8.2f} {bar}")

    print("\n" + "-" * 50)

    # Goals
    goal = 10000
    progress = (data["total"] / goal) * 100
    print(f"\n🎯 Goal: ${goal} MRR")
    print(f"📊 Progress: {progress:.1f}%")

    # Recent transactions
    history = data.get("history", [])[-5:]
    if history:
        print("\n📜 Recent:")
        for entry in reversed(history):
            print(f"  ${entry['amount']} - {entry['platform']} - {entry.get('note', '')}")

    print("\n" + "=" * 50 + "\n")


def main():
    import sys

    if len(sys.argv) < 2:
        show_dashboard()
        return

    cmd = sys.argv[1]

    if cmd == "add" and len(sys.argv) >= 4:
        amount = float(sys.argv[2])
        platform = sys.argv[3]
        note = " ".join(sys.argv[4:]) if len(sys.argv) > 4 else ""
        add_revenue(amount, platform, note)
        show_dashboard()
    elif cmd == "show":
        show_dashboard()
    else:
        print("Usage:")
        print("  python3 scripts/revenue_tracker.py          # Show dashboard")
        print("  python3 scripts/revenue_tracker.py add 47 gumroad 'First sale!'")


if __name__ == "__main__":
    main()
