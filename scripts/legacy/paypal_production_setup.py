#!/usr/bin/env python3
"""
🚀 PayPal Production Setup Script
==================================
Automates the transition from sandbox to production.

Prerequisites:
1. Verified PayPal Business Account
2. Live API credentials from PayPal Developer Dashboard
3. HTTPS endpoint for webhooks

Usage:
    python3 scripts/paypal_production_setup.py check
    python3 scripts/paypal_production_setup.py setup
    python3 scripts/paypal_production_setup.py verify
"""

import os
import sys
from pathlib import Path

import requests


def load_env():
    """Load .env file."""
    env_file = Path(".env")
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if "=" in line and not line.startswith("#"):
                key, val = line.split("=", 1)
                os.environ.setdefault(key.strip(), val.strip())


class PayPalProductionSetup:
    """
    PayPal Production Setup Helper.

    Checklist:
    1. ✅ Obtain live PayPal credentials
    2. ✅ Switch to production host (api-m.paypal.com)
    3. ✅ Register app with PayPal
    4. ✅ Set up production webhooks
    5. ✅ Test with real transaction
    """

    SANDBOX_HOST = "https://api-m.sandbox.paypal.com"
    PRODUCTION_HOST = "https://api-m.paypal.com"

    REQUIRED_ENV_VARS = [
        "PAYPAL_CLIENT_ID",
        "PAYPAL_CLIENT_SECRET",
        "PAYPAL_MODE",
    ]

    PRODUCTION_CHECKLIST = [
        "Verified PayPal Business account",
        "Live API credentials (not sandbox)",
        "HTTPS webhook endpoint",
        "SSL certificate valid",
        "Error handling implemented",
        "Logging configured",
        "Idempotency keys for transactions",
        "Rate limiting awareness",
    ]

    def __init__(self):
        load_env()
        self.client_id = os.environ.get("PAYPAL_CLIENT_ID")
        self.client_secret = os.environ.get("PAYPAL_CLIENT_SECRET")
        self.mode = os.environ.get("PAYPAL_MODE", "sandbox")

    def check_prerequisites(self):
        """Check all prerequisites for production."""
        print("\n🔍 PAYPAL PRODUCTION PREREQUISITES")
        print("=" * 60)

        issues = []

        # Check env vars
        print("\n📋 Environment Variables:")
        for var in self.REQUIRED_ENV_VARS:
            value = os.environ.get(var)
            if value:
                if var == "PAYPAL_MODE":
                    status = "✅" if value == "live" else "⚠️ (currently: {})".format(value)
                else:
                    status = "✅"
                print(f"  {status} {var}")
            else:
                print(f"  ❌ {var} - NOT SET")
                issues.append(f"{var} not configured")

        # Check mode
        print("\n⚙️ Current Mode:")
        if self.mode == "live":
            print("  ✅ PRODUCTION MODE")
        else:
            print("  ⚠️ SANDBOX MODE - Set PAYPAL_MODE=live for production")
            issues.append("Still in sandbox mode")

        # Check credentials format
        print("\n🔑 Credentials Check:")
        if self.client_id:
            if self.client_id.startswith("A"):
                print("  ✅ Client ID format looks valid")
            else:
                print("  ⚠️ Client ID format unusual")
        else:
            print("  ❌ No Client ID")
            issues.append("No Client ID")

        # Check webhook
        webhook_id = os.environ.get("PAYPAL_WEBHOOK_ID")
        print("\n🔔 Webhook Configuration:")
        if webhook_id:
            print(f"  ✅ Webhook ID: {webhook_id[:20]}...")
        else:
            print("  ⚠️ No webhook configured")
            print("     Run: python3 scripts/paypal_ai_agent.py webhook setup <url>")

        # Production checklist
        print("\n📝 Production Checklist:")
        for item in self.PRODUCTION_CHECKLIST:
            print(f"  □ {item}")

        print("\n" + "=" * 60)

        if issues:
            print(f"\n⚠️ {len(issues)} issue(s) found:")
            for issue in issues:
                print(f"   • {issue}")
            print()
            return False
        else:
            print("\n✅ All prerequisites met!")
            return True

    def test_auth(self):
        """Test authentication with current credentials."""
        import base64

        print("\n🔐 Testing Authentication...")

        if not self.client_id or not self.client_secret:
            print("  ❌ Missing credentials")
            return False

        base_url = self.PRODUCTION_HOST if self.mode == "live" else self.SANDBOX_HOST

        auth = base64.b64encode(f"{self.client_id}:{self.client_secret}".encode()).decode()

        try:
            response = requests.post(
                f"{base_url}/v1/oauth2/token",
                headers={
                    "Authorization": f"Basic {auth}",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data="grant_type=client_credentials",
                timeout=10,
            )

            if response.status_code == 200:
                data = response.json()
                print("  ✅ Authentication successful!")
                print(f"     App ID: {data.get('app_id', 'N/A')}")
                print(f"     Scope: {len(data.get('scope', '').split())} permissions")
                print(f"     Expires: {data.get('expires_in', 0)}s")
                return True
            else:
                print(f"  ❌ Authentication failed: {response.status_code}")
                print(f"     {response.text[:200]}")
                return False

        except Exception as e:
            print(f"  ❌ Connection error: {e}")
            return False

    def switch_to_production(self):
        """Guide for switching to production."""
        print("\n🚀 SWITCHING TO PRODUCTION")
        print("=" * 60)

        print("""
📋 STEP-BY-STEP GUIDE:

1️⃣ GET LIVE CREDENTIALS
   - Go to: https://developer.paypal.com/dashboard
   - Select your app (or create new)
   - Switch to "Live" tab
   - Copy Client ID and Secret

2️⃣ UPDATE .ENV FILE
   Replace sandbox credentials with live:
   
   PAYPAL_CLIENT_ID=<live_client_id>
   PAYPAL_CLIENT_SECRET=<live_secret>
   PAYPAL_MODE=live

3️⃣ SET UP PRODUCTION WEBHOOK
   python3 scripts/paypal_ai_agent.py webhook setup https://your-domain.com

4️⃣ VERIFY INTEGRATION
   python3 scripts/paypal_production_setup.py verify

5️⃣ MONITOR
   - Check PayPal Developer Dashboard for transactions
   - Monitor webhook events
   - Set up alerts for disputes

⚠️ IMPORTANT NOTES:
   - Production uses: api-m.paypal.com
   - Sandbox uses: api-m.sandbox.paypal.com
   - Test with small amounts first
   - Keep sandbox credentials for testing
""")

        print("=" * 60 + "\n")

    def verify_production(self):
        """Verify production setup is working."""
        print("\n✅ PRODUCTION VERIFICATION")
        print("=" * 60)

        all_ok = True

        # 1. Check mode
        print("\n1️⃣ Mode Check:")
        if self.mode == "live":
            print("   ✅ Production mode enabled")
        else:
            print("   ❌ Still in sandbox mode")
            all_ok = False

        # 2. Test auth
        print("\n2️⃣ Authentication:")
        if not self.test_auth():
            all_ok = False

        # 3. Check endpoint
        print("\n3️⃣ API Endpoint:")
        expected_url = self.PRODUCTION_HOST if self.mode == "live" else self.SANDBOX_HOST
        print(f"   🌐 Using: {expected_url}")

        # 4. Check webhook
        print("\n4️⃣ Webhook Status:")
        webhook_id = os.environ.get("PAYPAL_WEBHOOK_ID")
        if webhook_id:
            print(f"   ✅ Configured: {webhook_id[:15]}...")
        else:
            print("   ⚠️ Not configured (optional but recommended)")

        print("\n" + "=" * 60)

        if all_ok:
            print("\n🎉 PRODUCTION READY!")
            print("   Your PayPal integration is configured for live transactions.\n")
        else:
            print("\n⚠️ ISSUES FOUND")
            print("   Please address the issues above before going live.\n")

        return all_ok

    def update_env_for_production(self, client_id: str, client_secret: str):
        """Update .env file with production credentials."""
        env_file = Path(".env")

        if not env_file.exists():
            print("❌ .env file not found")
            return False

        content = env_file.read_text()

        # Backup
        backup = Path(".env.sandbox.backup")
        backup.write_text(content)
        print(f"✅ Backed up sandbox credentials to {backup}")

        # Update
        lines = content.splitlines()
        new_lines = []

        for line in lines:
            if line.startswith("PAYPAL_CLIENT_ID="):
                new_lines.append(f"PAYPAL_CLIENT_ID={client_id}")
            elif line.startswith("PAYPAL_CLIENT_SECRET="):
                new_lines.append(f"PAYPAL_CLIENT_SECRET={client_secret}")
            elif line.startswith("PAYPAL_MODE="):
                new_lines.append("PAYPAL_MODE=live")
            else:
                new_lines.append(line)

        env_file.write_text("\n".join(new_lines) + "\n")
        print("✅ Updated .env with production credentials")
        print("✅ PAYPAL_MODE set to 'live'")

        return True


def main():
    setup = PayPalProductionSetup()

    if len(sys.argv) < 2:
        print("""
🚀 PAYPAL PRODUCTION SETUP

Usage:
    python3 scripts/paypal_production_setup.py check
        Check prerequisites for production

    python3 scripts/paypal_production_setup.py setup
        Show step-by-step setup guide

    python3 scripts/paypal_production_setup.py verify
        Verify production is working

    python3 scripts/paypal_production_setup.py update <client_id> <secret>
        Update .env with production credentials
""")
        return

    cmd = sys.argv[1]

    if cmd == "check":
        setup.check_prerequisites()

    elif cmd == "setup":
        setup.switch_to_production()

    elif cmd == "verify":
        setup.verify_production()

    elif cmd == "update" and len(sys.argv) >= 4:
        setup.update_env_for_production(sys.argv[2], sys.argv[3])

    elif cmd == "test-auth":
        setup.test_auth()

    else:
        print(f"Unknown command: {cmd}")


if __name__ == "__main__":
    main()
