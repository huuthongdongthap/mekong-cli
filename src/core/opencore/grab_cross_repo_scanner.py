"""Read-only cross-repository scanner for 25-step Grab-standard and Open-Core catalogs."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from src.core.opencore.archetype_catalog_registry import (
    CatalogRegistry,
    classify_archetype,
    evaluate_sequence,
)
from src.core.opencore.grab_diagnostic_types import (
    ReadinessLabel,
    SequenceLabel,
    StepSpec,
)
from src.core.opencore.grab_market_facts import grab_standard_snapshot
from src.core.opencore.grab_probe_runner import execute_probe


@dataclass(frozen=True)
class StepDiagnosticRow:
    step_number: int
    layer: str
    slug: str
    industry_anchor: str
    evidence_class: str
    readiness: ReadinessLabel
    sequence: SequenceLabel

    def to_dict(self) -> dict[str, Any]:
        return {
            "step": self.step_number,
            "layer": self.layer,
            "slug": self.slug,
            "industry_anchor": self.industry_anchor,
            "evidence_class": self.evidence_class,
            "readiness": self.readiness.render(),
            "measurable": self.readiness.measurable,
            "probe_basis": self.readiness.probe_basis,
            "sequence": self.sequence.verdict.value,
            "violated_prerequisites": list(self.sequence.violated_prerequisites),
            "sequence_basis": self.sequence.basis,
        }


@dataclass(frozen=True)
class ScanReport:
    target_root: str
    archetype: str
    matched_keywords: tuple[str, ...]
    execute_runtime: bool
    market_facts: dict[str, Any]
    steps: tuple[StepDiagnosticRow, ...]

    def to_dict(self) -> dict[str, Any]:
        return {
            "target_root": self.target_root,
            "archetype": self.archetype,
            "matched_keywords": list(self.matched_keywords),
            "execute_runtime": self.execute_runtime,
            "market_facts": self.market_facts,
            "steps": [s.to_dict() for s in self.steps],
        }


def _detect_repo_archetype(target_root: Path) -> tuple[str, tuple[str, ...]]:
    hint_parts: list[str] = [target_root.name]
    for candidate in (
        "docs/product-direction/DURIOS-STRATEGY-V2.json",
        "README.md",
        "CLAUDE.md",
    ):
        p = target_root / candidate
        if p.is_file():
            hint_parts.append(p.read_text(encoding="utf-8", errors="ignore")[:2000])
    cls_res = classify_archetype(" ".join(hint_parts))
    if cls_res.archetype != "UNRESOLVED":
        return cls_res.archetype, cls_res.matched_keywords
    return "REGULATED_TRUST_NETWORK", ("auto_default_target",)


def scan_target_repository(
    target_root: str | Path,
    archetype: str = "auto",
    idea_text: str = "",
    execute_runtime: bool = True,
) -> ScanReport:
    """Scan a target repository in strictly read-only mode across 25 catalog steps."""
    root = Path(target_root).resolve()
    if archetype in ("", "auto"):
        if idea_text.strip():
            cls_res = classify_archetype(idea_text)
            resolved_arch, matched_kw = cls_res.archetype, cls_res.matched_keywords
        else:
            resolved_arch, matched_kw = _detect_repo_archetype(root)
    else:
        resolved_arch = archetype
        matched_kw = (f"explicit:{archetype}",)

    if resolved_arch == "UNRESOLVED":
        return ScanReport(
            target_root=str(root),
            archetype="UNRESOLVED",
            matched_keywords=(),
            execute_runtime=execute_runtime,
            market_facts=grab_standard_snapshot(root),
            steps=(),
        )

    catalog: tuple[StepSpec, ...] = CatalogRegistry.get_steps(resolved_arch)
    readiness_by_slug: dict[str, ReadinessLabel] = {}
    for spec in catalog:
        readiness_by_slug[spec.slug] = execute_probe(
            spec.probe, spec.evidence_class, root, execute_runtime=execute_runtime
        )

    rows: list[StepDiagnosticRow] = []
    for spec in catalog:
        r_lbl = readiness_by_slug[spec.slug]
        s_lbl = evaluate_sequence(spec, readiness_by_slug)
        rows.append(
            StepDiagnosticRow(
                step_number=spec.step_number,
                layer=spec.layer,
                slug=spec.slug,
                industry_anchor=spec.industry_anchor,
                evidence_class=spec.evidence_class.value,
                readiness=r_lbl,
                sequence=s_lbl,
            )
        )

    return ScanReport(
        target_root=str(root),
        archetype=resolved_arch,
        matched_keywords=matched_kw,
        execute_runtime=execute_runtime,
        market_facts=grab_standard_snapshot(root),
        steps=tuple(rows),
    )


def format_scan_lines(report: ScanReport) -> list[str]:
    """Format exactly one deterministic diagnostic line per step (25 lines)."""
    return [
        f"{row.step_number:02d} | {row.layer} | {row.slug} | "
        f"evidence={row.evidence_class} | readiness={row.readiness.render()} | "
        f"sequence={row.sequence.verdict.value} | basis={row.readiness.probe_basis}"
        for row in report.steps
    ]
