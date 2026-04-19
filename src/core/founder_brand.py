"""Founder Brand — /founder brand backend.

Brand identity engine: name generation (3 tracks x 5 = 15 candidates),
domain availability check, positioning (Moore template), tagline variants,
and brand voice guide.
"""

from __future__ import annotations

import json
import logging
import subprocess
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Literal

logger = logging.getLogger(__name__)

NamingTrack = Literal["descriptive", "invented", "metaphorical"]
TonePosition = Literal["minimal", "playful", "professional", "bold"]


@dataclass
class NameCandidate:
    """A brand name candidate with scoring."""

    name: str
    track: NamingTrack
    pronounceable: int  # 1-5
    memorable: int  # 1-5
    brandable: int  # 1-5
    domain_friendly: int  # 1-5
    available: str = "TBD"  # "FREE" | "TAKEN" | "TBD"

    @property
    def score(self) -> float:
        return (
            self.pronounceable
            + self.memorable
            + self.brandable
            + self.domain_friendly
        ) / 4.0


@dataclass
class DomainCheck:
    """Domain availability check result."""

    name: str
    dot_com: str = "TBD"
    dot_io: str = "TBD"
    dot_co: str = "TBD"
    github: str = "TBD"


@dataclass
class Positioning:
    """Geoffrey Moore positioning statement."""

    target_customer: str
    problem: str
    product_category: str
    key_benefit: str
    primary_alternative: str
    differentiator: str

    def render(self, company_name: str) -> str:
        return (
            f"FOR: {self.target_customer}\n"
            f"WHO: {self.problem}\n"
            f"{company_name} IS: {self.product_category}\n"
            f"THAT: {self.key_benefit}\n"
            f"UNLIKE: {self.primary_alternative}\n"
            f"OUR PRODUCT: {self.differentiator}"
        )


@dataclass
class Tagline:
    """A tagline variant."""

    strategy: str
    text: str
    word_count: int = 0

    def __post_init__(self) -> None:
        self.word_count = len(self.text.split())


@dataclass
class BrandVoice:
    """Brand voice guide."""

    personality: list[str]  # 3 adjectives
    never_sounds_like: list[str]  # 3 to avoid
    writing_rules: list[str]
    tone: str = "professional"  # overall feel


@dataclass
class SignageSpec:
    """Physical signage specification for construction."""

    name: str  # e.g. "Main Facade Sign"
    location: str  # e.g. "Front facade 8.3m width"
    dimensions_mm: tuple[int, int]  # (width, height) in mm
    material: str  # e.g. "Aluminum composite + LED neon"
    font: str  # e.g. "Space Grotesk Bold"
    letter_height_mm: int  # individual letter height
    illumination: str  # e.g. "LED neon tube, warm white 3000K"
    visibility_m: int  # readable distance in meters
    notes: str = ""


@dataclass
class MaterialPalette:
    """Physical material specs for construction."""

    name: str  # e.g. "Container Steel"
    surface: str  # e.g. "Corrugated steel panel"
    finish: str  # e.g. "Matte powder coat"
    ral_code: str  # e.g. "RAL 9005 Jet Black"
    hex_color: str  # matching hex for digital
    thickness_mm: float = 0.0
    notes: str = ""


@dataclass
class PrintSpec:
    """Print color specification (CMYK + Pantone)."""

    name: str  # e.g. "Master Gold"
    hex: str  # e.g. "#C9A200"
    cmyk: tuple[int, int, int, int]  # (C, M, Y, K)
    pantone: str  # e.g. "PMS 7405 C"
    usage: str  # e.g. "Logo, primary accent"


@dataclass
class BrandKit:
    """Complete brand identity kit."""

    company_name: str
    candidates: list[NameCandidate]
    domain_checks: list[DomainCheck]
    positioning: Positioning
    taglines: list[Tagline]
    voice: BrandVoice
    signage: list[SignageSpec] | None = None
    materials: list[MaterialPalette] | None = None
    print_specs: list[PrintSpec] | None = None


# ── Name Generation ──────────────────────────────────────────────────

TRACK_PATTERNS = {
    "descriptive": "action/benefit + domain/object (e.g., Dropbox, Basecamp)",
    "invented": "portmanteau, morphed word (e.g., Spotify, Figma)",
    "metaphorical": "unrelated concept, evocative (e.g., Apple, Stripe)",
}


def generate_name_candidates(
    product_desc: str,
    audience: str,
    tone: TonePosition = "professional",
) -> list[NameCandidate]:
    """Generate 15 name candidates across 3 tracks (placeholder names).

    In production, this calls LLM to generate creative names.
    Here we generate structured placeholders for the pipeline.
    """
    if not product_desc.strip():
        raise ValueError("Product description is required")

    candidates: list[NameCandidate] = []
    tracks: list[NamingTrack] = ["descriptive", "invented", "metaphorical"]

    # Generate 5 per track with descending scores
    for track in tracks:
        for i in range(5):
            candidates.append(
                NameCandidate(
                    name=f"{track.capitalize()}{i + 1}",
                    track=track,
                    pronounceable=max(1, 5 - i),
                    memorable=max(1, 5 - i),
                    brandable=max(1, 4 - i),
                    domain_friendly=max(1, 4 - i),
                )
            )

    return candidates


# ── Domain Check ─────────────────────────────────────────────────────


def check_domain_whois(name: str) -> DomainCheck:
    """Check domain availability via whois (best-effort)."""
    result = DomainCheck(name=name)

    for suffix, attr in [
        (".com", "dot_com"),
        (".io", "dot_io"),
        (".co", "dot_co"),
    ]:
        domain = f"{name.lower()}{suffix}"
        try:
            out = subprocess.run(
                ["whois", domain],
                capture_output=True,
                text=True,
                timeout=10,
            )
            text = out.stdout.lower()
            if any(kw in text for kw in ["no match", "not found", "available"]):
                setattr(result, attr, "FREE")
            elif out.returncode == 0 and text.strip():
                setattr(result, attr, "TAKEN")
            else:
                setattr(result, attr, "UNKNOWN")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            setattr(result, attr, "UNKNOWN")

    return result


def check_domains_batch(names: list[str]) -> list[DomainCheck]:
    """Check domain availability for multiple names."""
    return [check_domain_whois(name) for name in names]


# ── Positioning ──────────────────────────────────────────────────────


def build_positioning(
    target_customer: str,
    problem: str,
    product_category: str,
    key_benefit: str,
    primary_alternative: str,
    differentiator: str,
) -> Positioning:
    """Build Geoffrey Moore positioning statement."""
    for name, val in [
        ("target_customer", target_customer),
        ("problem", problem),
        ("product_category", product_category),
    ]:
        if not val or not val.strip():
            raise ValueError(f"{name} is required")

    return Positioning(
        target_customer=target_customer,
        problem=problem,
        product_category=product_category,
        key_benefit=key_benefit or "unique value proposition",
        primary_alternative=primary_alternative or "existing tools",
        differentiator=differentiator or "specific differentiating claim",
    )


def generate_elevator_pitches(
    company_name: str, positioning: Positioning, traction: str = ""
) -> dict[str, str]:
    """Generate elevator pitches at different lengths."""
    return {
        "10s_party": (
            f"{company_name} lets {positioning.target_customer} "
            f"{positioning.key_benefit} without {positioning.problem}."
        ),
        "30s_investor": (
            f"We built {positioning.product_category} for "
            f"{positioning.target_customer}. {traction or 'Early traction.'}  "
            f"Unlike {positioning.primary_alternative}, "
            f"{positioning.differentiator}."
        ),
        "2min_demo": "Problem → Solution → Traction → Why now → Ask",
    }


# ── Taglines ─────────────────────────────────────────────────────────

TAGLINE_STRATEGIES = [
    "outcome-focused",
    "contrast",
    "provocative",
    "audience-call",
    "minimalist",
]


def generate_taglines(
    company_name: str,
    key_benefit: str,
    target: str,
) -> list[Tagline]:
    """Generate tagline variants across 5 strategies."""
    taglines = [
        Tagline("outcome-focused", f"Your {key_benefit}, fully automated"),
        Tagline("outcome-focused", f"From idea to revenue, via {company_name}"),
        Tagline("outcome-focused", f"{key_benefit}. No team required."),
        Tagline("contrast", "Not a tool. An operating system."),
        Tagline("contrast", "Not AI-assisted. AI-operated."),
        Tagline("contrast", "Beyond automation. Full operation."),
        Tagline("provocative", "The last hire you'll ever need"),
        Tagline("provocative", "Your startup runs while you sleep"),
        Tagline("provocative", "One founder. Zero limits."),
        Tagline("audience-call", f"For {target} who build alone"),
        Tagline("audience-call", "If you can type, you can scale"),
        Tagline("audience-call", f"Built for {target}, by {target}"),
        Tagline("minimalist", f"{company_name}. Ship. Scale."),
        Tagline("minimalist", "Operate at agent speed."),
        Tagline("minimalist", "Type. Build. Revenue."),
    ]
    return taglines


# ── Brand Voice ──────────────────────────────────────────────────────


def build_voice_guide(
    tone: TonePosition = "professional",
) -> BrandVoice:
    """Generate brand voice guide based on desired tone."""
    tone_map = {
        "minimal": {
            "personality": ["precise", "clean", "confident"],
            "avoid": ["flowery", "corporate", "dramatic"],
        },
        "playful": {
            "personality": ["witty", "approachable", "energetic"],
            "avoid": ["corporate", "dry", "overly formal"],
        },
        "professional": {
            "personality": ["expert", "trustworthy", "clear"],
            "avoid": ["casual", "slangy", "buzzword-heavy"],
        },
        "bold": {
            "personality": ["provocative", "direct", "ambitious"],
            "avoid": ["timid", "passive", "apologetic"],
        },
    }

    config = tone_map.get(tone, tone_map["professional"])

    return BrandVoice(
        personality=config["personality"],
        never_sounds_like=config["avoid"],
        writing_rules=[
            "Write like talking to a smart friend",
            "Use active voice",
            "Lead with benefit, not feature",
            "Use numbers when possible",
            "Short sentences for punch. Then longer for rhythm.",
            "Never use: leverage, synergy, world-class, cutting-edge",
            "Never start with 'We are...' — start with what you do",
        ],
        tone=tone,
    )


# ── File I/O ─────────────────────────────────────────────────────────


def save_brand_kit(base_dir: str, kit: BrandKit) -> list[str]:
    """Save complete brand kit to .mekong/brand/."""
    brand_dir = Path(base_dir) / ".mekong" / "brand"
    brand_dir.mkdir(parents=True, exist_ok=True)
    saved: list[str] = []

    # Name candidates
    path = brand_dir / "name-candidates.json"
    path.write_text(json.dumps(
        [asdict(c) for c in kit.candidates],
        indent=2, ensure_ascii=False,
    ))
    saved.append(str(path))

    # Domain availability
    path = brand_dir / "domain-availability.json"
    path.write_text(json.dumps(
        [asdict(d) for d in kit.domain_checks],
        indent=2, ensure_ascii=False,
    ))
    saved.append(str(path))

    # Positioning
    path = brand_dir / "positioning.json"
    path.write_text(json.dumps(asdict(kit.positioning), indent=2, ensure_ascii=False))
    saved.append(str(path))

    # Taglines
    path = brand_dir / "taglines.json"
    path.write_text(json.dumps(
        [asdict(t) for t in kit.taglines],
        indent=2, ensure_ascii=False,
    ))
    saved.append(str(path))

    # Voice guide
    path = brand_dir / "voice-guide.json"
    path.write_text(json.dumps(asdict(kit.voice), indent=2, ensure_ascii=False))
    saved.append(str(path))

    logger.info("Saved %d brand files to %s", len(saved), brand_dir)
    return saved


# ── FnB-Specific Generators ─────────────────────────────────────────


def generate_fnb_signage(
    brand_name: str,
    facade_width_m: float = 8.3,
    font: str = "Space Grotesk Bold",
) -> list[SignageSpec]:
    """Generate signage specs for an FnB container café."""
    return [
        SignageSpec(
            name="Main Facade Sign",
            location=f"Front facade {facade_width_m}m width, centered above entry",
            dimensions_mm=(int(facade_width_m * 1000 * 0.6), 600),
            material="Aluminum composite panel + LED neon channel letters",
            font=font,
            letter_height_mm=300,
            illumination="LED neon flex, warm gold 2700K, IP65",
            visibility_m=50,
            notes="Readable from across street (Hotel Thảo Trâm viewpoint)",
        ),
        SignageSpec(
            name="Rooftop Edge Sign",
            location="Rooftop parapet, facing street",
            dimensions_mm=(3000, 400),
            material="Stainless steel frame + LED neon tube",
            font=font,
            letter_height_mm=250,
            illumination="LED neon tube, electric gold, IP67",
            visibility_m=100,
            notes="Night visibility target: Hotel guests across street",
        ),
        SignageSpec(
            name="Menu Board Outdoor",
            location="Entry area, beside parking zone",
            dimensions_mm=(900, 1200),
            material="Powder-coated steel frame + acrylic insert",
            font="Inter Medium",
            letter_height_mm=18,
            illumination="Edge-lit LED panel, 4000K neutral white",
            visibility_m=3,
        ),
        SignageSpec(
            name="Wayfinding — Stairs",
            location="At staircase entrance to rooftop",
            dimensions_mm=(300, 150),
            material="Brushed steel plate, laser-cut text",
            font="JetBrains Mono",
            letter_height_mm=40,
            illumination="Backlit LED strip, warm white",
            visibility_m=5,
            notes="Arrow + text: ROOFTOP ↑",
        ),
        SignageSpec(
            name="Wayfinding — WC",
            location="Near WC + storage area, rear of lot",
            dimensions_mm=(200, 100),
            material="Acrylic plate, vinyl cut",
            font="Inter",
            letter_height_mm=30,
            illumination="None (ambient lit area)",
            visibility_m=3,
        ),
    ]


def generate_fnb_materials() -> list[MaterialPalette]:
    """Generate material palette for container café construction."""
    return [
        MaterialPalette(
            name="Container Steel — Exterior",
            surface="Corrugated steel panel (40ft + 20ft containers)",
            finish="Matte powder coat",
            ral_code="RAL 9005 Jet Black",
            hex_color="#0A0A0A",
            thickness_mm=2.0,
            notes="Original container surface, repainted",
        ),
        MaterialPalette(
            name="Container Steel — Interior",
            surface="Flat steel panel, insulated",
            finish="Satin powder coat",
            ral_code="RAL 7021 Black Grey",
            hex_color="#1A1A1A",
            thickness_mm=1.5,
        ),
        MaterialPalette(
            name="Neon Tubing — Gold",
            surface="Silicone neon flex tube",
            finish="Diffused glow",
            ral_code="N/A",
            hex_color="#C9A200",
            thickness_mm=12.0,
            notes="Neon flex 12mm, 12V DC, 120 LED/m, CRI>80",
        ),
        MaterialPalette(
            name="Tempered Glass — Partition",
            surface="Tempered safety glass",
            finish="Clear, polished edge",
            ral_code="N/A",
            hex_color="#F5F5F5",
            thickness_mm=10.0,
            notes="Rooftop glass wall, wind-rated",
        ),
        MaterialPalette(
            name="Cement Board — Rooftop Deck",
            surface="Fiber cement board (Cemboard)",
            finish="Anti-slip textured, sealed",
            ral_code="RAL 7035 Light Grey",
            hex_color="#C4C4C4",
            thickness_mm=18.0,
            notes="Load-bearing rooftop floor on steel frame",
        ),
        MaterialPalette(
            name="Canopy Fabric — Rooftop",
            surface="HDPE shade cloth or PVC awning",
            finish="UV-resistant matte",
            ral_code="RAL 9005 Jet Black",
            hex_color="#111111",
            thickness_mm=0.5,
            notes="Retractable canopy, wind-rated 60km/h",
        ),
    ]


def generate_fnb_print_specs() -> list[PrintSpec]:
    """Generate CMYK + Pantone print specs for AURA SPACE brand colors."""
    return [
        PrintSpec("Midnight Black", "#0A0A0A", (0, 0, 0, 100), "PMS Black 6 C", "Logo, backgrounds"),
        PrintSpec("Aura Black", "#111111", (0, 0, 0, 95), "PMS Black 7 C", "Secondary backgrounds"),
        PrintSpec("Container Steel", "#1A1A1A", (0, 0, 0, 90), "PMS 426 C", "Card backgrounds"),
        PrintSpec("Master Gold", "#C9A200", (0, 12, 100, 18), "PMS 7405 C", "Logo, primary accent, signage"),
        PrintSpec("Electric Gold", "#FFD700", (0, 6, 100, 0), "PMS 116 C", "Neon effects, highlights"),
        PrintSpec("Matte Gold", "#B8860B", (0, 20, 95, 25), "PMS 1245 C", "Premium print, emboss"),
        PrintSpec("Neon Amber", "#FFB300", (0, 18, 100, 0), "PMS 137 C", "Accent, glow effects"),
        PrintSpec("Smoke Gray", "#9E9E9E", (0, 0, 0, 38), "PMS Cool Gray 7 C", "Body text on dark"),
        PrintSpec("Pure White", "#F5F5F5", (0, 0, 0, 2), "PMS 663 C", "Text on dark backgrounds"),
    ]
