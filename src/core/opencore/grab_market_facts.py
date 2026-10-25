"""Market constants, recomputed SaaS ceiling arithmetic, and V2 reference document SHA-256 snapshot."""
from __future__ import annotations

import hashlib
import math
from pathlib import Path
from typing import Any

PACKHOUSES_VN: int = 281
REGISTERED_PUC_ORCHARDS_VN: int = 1599
MALAYSIA_PACKHOUSES: int = 52
SAAS_PRICE_VND_PER_YEAR: int = 60_000_000
VND_PER_USD: int = 25_637
TARGET_ARR_USD: int = 1_000_000

PINNED_V2_DOC_DIGESTS: dict[str, str] = {
    "docs/product-direction/VALIDATION-AND-ECONOMICS-V2.md": (
        "f5abaf4f624be04466fc7881f67d12a9a645a400e8effb1fba651d5d7748c826"
    ),
    "docs/product-direction/PRODUCT-VISION-V2.md": (
        "a42305e0691f9ddb80219a90e5ed7cfad34a6d7e4c5c05a974fde65ca3a1f5f2"
    ),
    "docs/product-direction/STRATEGY-V2-BACKLOG.md": (
        "39ea1abb2d9b1a67daf1998019104d650955c77a0583975dbf30972925a3a758"
    ),
    "docs/product-direction/DURIOS-STRATEGY-V2.json": (
        "f82cd25b3750947fc1951ab7aee7c8995a65a27e0de54e05a2c70754f0e18088"
    ),
}


def recompute_saas_ceiling(
    target_arr_usd: int = TARGET_ARR_USD,
    vnd_per_usd: int = VND_PER_USD,
    saas_price_vnd_year: int = SAAS_PRICE_VND_PER_YEAR,
    active_packhouses: int = PACKHOUSES_VN,
) -> tuple[int, bool]:
    """Recompute required packhouses for target ARR and whether pure SaaS is mathematically feasible."""
    required_sites = math.ceil((target_arr_usd * vnd_per_usd) / saas_price_vnd_year)
    saas_only_feasible = required_sites <= active_packhouses
    return required_sites, saas_only_feasible


def grab_standard_snapshot(target_root: Path | None = None) -> dict[str, Any]:
    """Return recomputed market arithmetic and SHA-256 digests of the V2 reference documents."""
    required_sites, saas_only_feasible = recompute_saas_ceiling()
    max_vn_saas_arr_usd = round((PACKHOUSES_VN * SAAS_PRICE_VND_PER_YEAR) / VND_PER_USD)
    digests: dict[str, str] = {}
    for rel_path, pinned in PINNED_V2_DOC_DIGESTS.items():
        if target_root is not None and (target_root / rel_path).is_file():
            raw = (target_root / rel_path).read_bytes()
            digests[rel_path] = hashlib.sha256(raw).hexdigest()
        else:
            digests[rel_path] = pinned
    combined = hashlib.sha256(
        "|".join(f"{k}:{v}" for k, v in sorted(digests.items())).encode("utf-8")
    ).hexdigest()
    return {
        "approval_status": "DRAFT_FOR_FOUNDER_REVIEW",
        "vietnam_active_packhouses": PACKHOUSES_VN,
        "vietnam_registered_puc_orchards": REGISTERED_PUC_ORCHARDS_VN,
        "malaysia_packhouses": MALAYSIA_PACKHOUSES,
        "saas_price_vnd_per_year": SAAS_PRICE_VND_PER_YEAR,
        "exchange_rate_vnd_usd": VND_PER_USD,
        "target_arr_usd": TARGET_ARR_USD,
        "max_vietnam_saas_arr_usd": max_vn_saas_arr_usd,
        "sites_required_for_1m_arr": required_sites,
        "saas_only_feasible": saas_only_feasible,
        "formula": f"ceil({TARGET_ARR_USD}*{VND_PER_USD}/{SAAS_PRICE_VND_PER_YEAR})={required_sites}>{PACKHOUSES_VN}",
        "reference_doc_digests": digests,
        "combined_sha256": combined,
    }
