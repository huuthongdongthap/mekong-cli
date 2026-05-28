"""
Gumroad Product Publisher
=========================
Handles batch publishing of AgencyOS products to Gumroad.
"""

import os
from pathlib import Path
from typing import Any, Dict, List

# Product Definitions
PRODUCTS = [
    {
        "name": "AI Skills Pack - Antigravity Skills",
        "price": 2700,  # $27
        "description": """🤖 AI Skills for Antigravity IDE

✨ What's Inside:
- 9 Professional AI Skills
- Gemini, OpenAI, Vector DB integrations
- Backend & Frontend automation
- Full documentation

💡 Perfect For:
- Antigravity IDE users
- AI-powered development
- Agentic workflows

🚀 Install: Copy to .agent/skills/""",
        "zip_path": "products/ai-skills-pack-v1.0.0.zip",
        "thumbnail_path": "products/thumbnails/ai-skills-pack-cover.png",
    },
    {
        "name": "Vietnamese Agency Kit - Binh Pháp Business Framework",
        "price": 6700,  # $67
        "description": """🇻🇳 Vietnamese Agency Kit

✨ Local Market Presets:
- 10 Industry Niches
- Vietnamese Language Pack
- Regional Compliance
- Local Payment Gateways

🌾 Niches Included:
- Lúa Gạo (Rice Trading)
- Cá Tra (Seafood)
- Nội Thất (Furniture)
- Bất Động Sản (Real Estate)
- Nhà Hàng (Restaurants)
- Spa/Beauty

🎯 Perfect For:
- Vietnam-focused agencies
- Local market entry""",
        "zip_path": "products/vietnamese-agency-kit-v1.0.0.zip",
        "thumbnail_path": "products/thumbnails/vietnamese-agency-kit-cover.png",
    },
    {
        "name": "AgencyOS Pro - Complete Agency Bundle",
        "price": 19700,  # $197
        "description": """🏯 AgencyOS Pro - Complete Agency Platform

✨ Everything You Need:
- CRM + Invoicing
- Project Management
- Client Portal
- Analytics Dashboard
- 40+ Workflows
- Vietnamese Localization

💰 Revenue Features:
- Subscription Management
- Braintree Integration
- Revenue Tracking

⚡ Production-Ready: Deploy in 1 hour""",
        "zip_path": "products/agencyos-pro-v1.0.0.zip",
        "thumbnail_path": "products/thumbnails/agencyos-pro-cover.png",
    },
    {
        "name": "AgencyOS Enterprise - Multi-Team Platform",
        "price": 49700,  # $497
        "description": """🏛️ AgencyOS Enterprise - White-Label Platform

✨ Enterprise Features:
- Multi-tenant Architecture
- White-label Ready
- Custom Branding
- SSO/SAML Support
- Priority Support
- Source Code Access

📊 Scale Ready:
- 100+ Team Members
- Unlimited Clients

🔒 Security:
- SOC2 Compliance Ready
- Data Encryption""",
        "zip_path": "products/agencyos-enterprise-v1.0.0.zip",
        "thumbnail_path": "products/thumbnails/agencyos-enterprise-cover.png",
    },
]


class GumroadPublisher:
    """Handles interaction with Gumroad API for product publishing."""

    API_URL = "https://api.gumroad.com/v2"

    def __init__(self):
        self.token = os.environ.get("GUMROAD_ACCESS_TOKEN")

    def check_files(self) -> List[str]:
        """Verify existence of all product files."""
        missing = []
        for p in PRODUCTS:
            if not Path(p["zip_path"]).exists():
                missing.append(p["zip_path"])
            # Thumbnails are optional but good to check
            # if not Path(p["thumbnail_path"]).exists():
            #     missing.append(p["thumbnail_path"])
        return missing

    def dry_run(self) -> Dict[str, Any]:
        """Preview publishing process."""
        missing = self.check_files()
        total_value = sum(p["price"] for p in PRODUCTS) / 100

        return {
            "products": PRODUCTS,
            "missing_files": missing,
            "total_value": total_value,
            "has_token": bool(self.token),
        }

    def publish_all(self) -> List[Dict[str, Any]]:
        """Publish all products to Gumroad."""
        if not self.token:
            raise ValueError("GUMROAD_ACCESS_TOKEN not set")

        import requests  # Import here to avoid dependency if just doing dry run

        results = []
        for product in PRODUCTS:
            try:
                # 1. Create Product
                data = {
                    "name": product["name"],
                    "description": product["description"],
                    "price": product["price"],
                    "currency": "usd",
                    "access_token": self.token,
                }

                resp = requests.post(f"{self.API_URL}/products", data=data)
                resp.raise_for_status()
                result = resp.json()

                if not result.get("success"):
                    results.append(
                        {"name": product["name"], "status": "error", "error": str(result)}
                    )
                    continue

                prod_data = result.get("product", {})
                pid = prod_data.get("id")
                url = prod_data.get("short_url")

                # 2. Upload File
                zip_path = Path(product["zip_path"])
                if zip_path.exists():
                    with open(zip_path, "rb") as f:
                        files = {"file": f}
                        resp = requests.post(
                            f"{self.API_URL}/products/{pid}/files",
                            data={"access_token": self.token},
                            files=files,
                        )

                # 3. Enable Product
                requests.put(
                    f"{self.API_URL}/products/{pid}/enable", data={"access_token": self.token}
                )

                results.append(
                    {"name": product["name"], "status": "success", "url": url, "id": pid}
                )

            except Exception as e:
                results.append({"name": product["name"], "status": "error", "error": str(e)})

        return results
