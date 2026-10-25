"""Archetype CatalogRegistry, deterministic keyword classifier, and mechanical sequence evaluator."""
from __future__ import annotations

from dataclasses import dataclass
from typing import ClassVar

from src.core.opencore.durian_export_25_step_catalog import (
    TWENTY_FIVE_DURIAN_GRAB_STEPS,
)
from src.core.opencore.grab_diagnostic_types import (
    EvidenceClass,
    GrepSymbol,
    ReadinessLabel,
    ReadinessLevel,
    SequenceLabel,
    SequenceVerdict,
    StepSpec,
)
from src.core.opencore.phase_559_opencore_25_step_catalog import (
    TWENTY_FIVE_OPENCORE_STEPS,
)


@dataclass(frozen=True)
class ArchetypeClassification:
    archetype: str
    matched_keywords: tuple[str, ...]
    scores: dict[str, int]


def _adapt_opencore_steps() -> tuple[StepSpec, ...]:
    return tuple(
        StepSpec(
            step_number=s.step_number,
            layer=s.phase.value,
            slug=s.slug,
            industry_anchor=f"{s.oss_public_surface} -> {s.saas_monetized_surface}",
            evidence_class=EvidenceClass.STATIC_SOURCE,
            probe=GrepSymbol(symbol=s.slug.replace("-", "_"), min_occurrences=1),
        )
        for s in TWENTY_FIVE_OPENCORE_STEPS
    )


class CatalogRegistry:
    """Maps an archetype identifier to its declarative 25-step catalog and keyword triggers."""

    _CATALOGS: ClassVar[dict[str, tuple[StepSpec, ...]]] = {
        "REGULATED_TRUST_NETWORK": TWENTY_FIVE_DURIAN_GRAB_STEPS,
        "OPEN_CORE_SAAS": _adapt_opencore_steps(),
    }
    _KEYWORDS: ClassVar[dict[str, tuple[str, ...]]] = {
        "REGULATED_TRUST_NETWORK": (
            "sầu riêng", "durian", "gacc", "puc", "phytosanitary", "kiểm dịch",
            "chuỗi lạnh", "cadmium", "cadimi", "grab", "nông nghiệp", "xuất khẩu",
            "packhouse", "vựa", "container dossier",
        ),
        "OPEN_CORE_SAAS": (
            "open-core", "opencore", "mã nguồn mở", "public github", "github",
            "mit license", "byok", "mcu", "paywall", "saas",
        ),
    }

    @classmethod
    def register_catalog(
        cls,
        archetype: str,
        steps: tuple[StepSpec, ...],
        keywords: tuple[str, ...],
    ) -> None:
        if len(steps) != 25:
            raise ValueError(f"Catalog '{archetype}' must contain 25 steps (got {len(steps)})")
        cls._CATALOGS[archetype] = steps
        cls._KEYWORDS[archetype] = tuple(k.lower() for k in keywords)

    @classmethod
    def get_steps(cls, archetype: str) -> tuple[StepSpec, ...]:
        if archetype not in cls._CATALOGS:
            raise KeyError(f"Unregistered archetype '{archetype}'. Known: {sorted(cls._CATALOGS)}")
        return cls._CATALOGS[archetype]

    @classmethod
    def keyword_table(cls) -> dict[str, tuple[str, ...]]:
        return dict(cls._KEYWORDS)


def classify_archetype(idea_text: str) -> ArchetypeClassification:
    """Deterministically classify idea text by keyword hits; return UNRESOLVED when no domain matches."""
    lowered = idea_text.lower()
    scores: dict[str, int] = {}
    matched_by_arch: dict[str, list[str]] = {}
    for arch, kw_list in CatalogRegistry.keyword_table().items():
        hits = [kw for kw in kw_list if kw in lowered]
        scores[arch] = len(hits)
        matched_by_arch[arch] = hits

    best_arch = max(scores, key=lambda a: (scores[a], a != "OPEN_CORE_SAAS"), default="UNRESOLVED")
    if scores.get(best_arch, 0) == 0:
        return ArchetypeClassification("UNRESOLVED", (), scores)
    return ArchetypeClassification(best_arch, tuple(matched_by_arch[best_arch]), scores)


def evaluate_sequence(
    step: StepSpec,
    readiness_by_slug: dict[str, ReadinessLabel],
) -> SequenceLabel:
    """Mechanically compute SequenceLabel from prerequisite readiness and NOT_AUTHORIZED rules."""
    own = readiness_by_slug.get(step.slug)
    has_code = own is not None and own.measurable and own.level.rank >= ReadinessLevel.DECLARED.rank

    if step.not_authorized_covers and has_code:
        return SequenceLabel(
            SequenceVerdict.PREMATURE,
            step.not_authorized_covers,
            f"code present for NOT_AUTHORIZED scope: {','.join(step.not_authorized_covers)}",
        )
    if not step.mandatory_prerequisites:
        return SequenceLabel(SequenceVerdict.IN_ORDER, (), "root_step_no_prerequisites")

    violated_code: list[str] = []
    unmeasurable_prereqs: list[str] = []
    for prereq in step.mandatory_prerequisites:
        p_lbl = readiness_by_slug.get(prereq)
        if p_lbl is None or not p_lbl.measurable:
            unmeasurable_prereqs.append(prereq)
        elif p_lbl.level.rank <= ReadinessLevel.DECLARED.rank:
            violated_code.append(prereq)

    if has_code and violated_code:
        return SequenceLabel(
            SequenceVerdict.PREMATURE,
            tuple(violated_code + unmeasurable_prereqs),
            f"built_ahead_of:{','.join(violated_code)}",
        )
    if unmeasurable_prereqs:
        return SequenceLabel(
            SequenceVerdict.INDETERMINATE,
            tuple(unmeasurable_prereqs),
            f"market_or_live_gate_unmeasurable:{','.join(unmeasurable_prereqs)}",
        )
    if violated_code:
        return SequenceLabel(
            SequenceVerdict.IN_ORDER,
            tuple(violated_code),
            f"pending_prerequisites:{','.join(violated_code)}",
        )
    return SequenceLabel(SequenceVerdict.IN_ORDER, (), "all_prerequisites_satisfied")
