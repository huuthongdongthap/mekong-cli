"""Tests for the 25-step Durian Export Grab-standard honest diagnostic engine and cross-repo scanner."""
from __future__ import annotations

import json
from pathlib import Path
import subprocess
from typer.testing import CliRunner

from src.cli.idea_commands import app as idea_app
from src.core.opencore.archetype_catalog_registry import (
    CatalogRegistry,
    classify_archetype,
    evaluate_sequence,
)
from src.core.opencore.durian_export_25_step_catalog import (
    TWENTY_FIVE_DURIAN_GRAB_STEPS,
)
from src.core.opencore.grab_cross_repo_scanner import scan_target_repository
from src.core.opencore.grab_diagnostic_types import (
    ArtifactSchema,
    AstTypePresent,
    EvidenceClass,
    GrepSymbol,
    ProductionCallerCount,
    ReadinessLabel,
    ReadinessLevel,
    RuntimeExec,
    SequenceVerdict,
    StepSpec,
)
from src.core.opencore.grab_market_facts import (
    PACKHOUSES_VN,
    grab_standard_snapshot,
    recompute_saas_ceiling,
)
from src.core.opencore.grab_probe_runner import execute_probe
from src.core.opencore.phase_559_opencore_25_step_catalog import (
    TWENTY_FIVE_OPENCORE_STEPS,
)
from src.core.opencore.phase_560_opencore_saas_readiness_engine import (
    OpenCoreSaasReadinessEngine,
)

REPO_ROOT = Path(__file__).resolve().parents[1]
DURIOS_ROOT = Path("/Users/macbook/durios")
runner = CliRunner()


def test_phase_559_opencore_catalog_is_byte_unchanged() -> None:
    proc = subprocess.run(
        ["git", "-C", str(REPO_ROOT), "diff", "HEAD", "--", "src/core/opencore/phase_559_opencore_25_step_catalog.py"],
        capture_output=True, text=True, check=False,
    )
    assert proc.stdout == "" and len(TWENTY_FIVE_OPENCORE_STEPS) == 25


def test_recompute_market_arithmetic_proves_pure_saas_impossible() -> None:
    required_sites, saas_only_feasible = recompute_saas_ceiling()
    assert required_sites == 428 and required_sites > PACKHOUSES_VN == 281 and saas_only_feasible is False
    snap = grab_standard_snapshot(DURIOS_ROOT if DURIOS_ROOT.is_dir() else None)
    assert snap["sites_required_for_1m_arr"] == 428 and snap["saas_only_feasible"] is False and len(snap["combined_sha256"]) == 64


def test_archetype_classifier_deterministic_and_unresolved_fallback() -> None:
    durian = classify_archetype("tái cấu trúc deep /idea 25 bước theo tiêu chuẩn GRAB trong nghành nông nghiệp ngách sầu riêng xuất khẩu")
    assert durian.archetype == "REGULATED_TRUST_NETWORK" and any(k in durian.matched_keywords for k in ("sầu riêng", "grab", "xuất khẩu"))
    oc = classify_archetype("25 bước tái cấu trúc thành dự án mã nguồn mở public github nhưng vẫn thu được SaaS")
    assert oc.archetype == "OPEN_CORE_SAAS" and ("github" in oc.matched_keywords or "mã nguồn mở" in oc.matched_keywords)
    unknown = classify_archetype("mở tiệm giặt ủi nhỏ ở phường 4")
    assert unknown.archetype == "UNRESOLVED" and unknown.matched_keywords == ()


def test_probe_primitives_and_rehearsal_exclusion(tmp_path: Path) -> None:
    src = tmp_path / "src" / "server"
    src.mkdir(parents=True)
    (src / "ecosystem-rehearsal-handler.ts").write_text(
        "import { isMarketplaceFeatureUnlocked } from '../marketplace/marketplace-guard.js';\n"
        "export const x = isMarketplaceFeatureUnlocked({ goForLiveCustomerData: true });\n",
        encoding="utf-8",
    )
    mkt = tmp_path / "src" / "marketplace"
    mkt.mkdir(parents=True)
    (mkt / "marketplace-guard.ts").write_text(
        "export interface MarketplaceDualLockContext { readonly goForLiveCustomerData: boolean; }\n"
        "export function isMarketplaceFeatureUnlocked(c: MarketplaceDualLockContext): boolean { return false; }\n",
        encoding="utf-8",
    )
    lbl = execute_probe(ProductionCallerCount(symbol="isMarketplaceFeatureUnlocked", min_callers=1), EvidenceClass.STATIC_SOURCE, tmp_path, False)
    assert lbl.level == ReadinessLevel.IMPLEMENTED and "prod_callers=0" in lbl.probe_basis
    lbl_ast = execute_probe(AstTypePresent(type_names=("MarketplaceDualLockContext", "MissingEntity")), EvidenceClass.STATIC_SOURCE, tmp_path, False)
    assert lbl_ast.level == ReadinessLevel.DECLARED
    rt = RuntimeExec("src/marketplace/marketplace-guard.ts", "isMarketplaceFeatureUnlocked", "true", "locked")
    lbl_rt = execute_probe(rt, EvidenceClass.RUNTIME_BEHAVIOR, tmp_path, execute_runtime=False)
    assert lbl_rt.level == ReadinessLevel.GUARDED and "no-execute" in lbl_rt.probe_basis


def test_sequence_evaluator_flags_premature_and_indeterminate() -> None:
    step_market = TWENTY_FIVE_DURIAN_GRAB_STEPS[15]
    rmap = {
        "verified-trade-room": ReadinessLabel(ReadinessLevel.GUARDED, True, "marketplace-guard.ts"),
        "PLATFORM-01": ReadinessLabel(ReadinessLevel.ABSENT, False, "market gate"),
    }
    assert evaluate_sequence(step_market, rmap).verdict in (SequenceVerdict.INDETERMINATE, SequenceVerdict.PREMATURE)
    step_corridor = TWENTY_FIVE_DURIAN_GRAB_STEPS[22]
    rmap["corridor-sequencing-integrity"] = ReadinessLabel(ReadinessLevel.DECLARED, True, "MY_CN/TH_CN declared")
    rmap["puc-orchard-registry"] = ReadinessLabel(ReadinessLevel.ABSENT, True, "0 files")
    seq_c = evaluate_sequence(step_corridor, rmap)
    assert seq_c.verdict == SequenceVerdict.PREMATURE and "puc-orchard-registry" in seq_c.violated_prerequisites


def test_third_industry_catalog_registers_without_engine_changes(tmp_path: Path) -> None:
    dummy_steps = tuple(
        StepSpec(
            i, "P1_CORE", f"coffee-step-{i}", "ICO Robusta Standard",
            EvidenceClass.STATIC_SOURCE if i < 25 else EvidenceClass.MARKET,
            GrepSymbol("RobustaLot", 1) if i < 25 else ArtifactSchema("pilot.json", "json", ("approved",)),
        )
        for i in range(1, 26)
    )
    CatalogRegistry.register_catalog("COFFEE_EXPORT_TEST", dummy_steps, ("cà phê robusta", "ico robusta"))
    assert classify_archetype("mạng lưới xuất khẩu cà phê robusta chuẩn ico robusta").archetype == "COFFEE_EXPORT_TEST"
    report = scan_target_repository(tmp_path, archetype="COFFEE_EXPORT_TEST", execute_runtime=False)
    assert len(report.steps) == 25 and report.steps[-1].readiness.render() == "UNMEASURABLE"


def test_durios_cross_repo_scan_and_cli_preserves_clean_target() -> None:
    target = DURIOS_ROOT if DURIOS_ROOT.is_dir() else REPO_ROOT
    before = subprocess.run(["git", "-C", str(target), "status", "--porcelain"], capture_output=True, text=True, check=False).stdout
    res_txt = runner.invoke(idea_app, ["scan", "--target-root", str(target), "--archetype", "auto"])
    assert res_txt.exit_code == 0 and len([ln for ln in res_txt.stdout.splitlines() if ln.strip()]) == 25
    res = runner.invoke(idea_app, ["scan", "--target-root", str(target), "--archetype", "auto", "--json"])
    assert res.exit_code == 0
    data = json.loads(res.stdout)
    assert len(data["steps"]) == 25 and data["market_facts"]["sites_required_for_1m_arr"] == 428
    replay = runner.invoke(idea_app, ["scan", "--target-root", str(target), "--archetype", "auto", "--json", "--replay"])
    assert replay.exit_code == 0 and json.loads(replay.stdout)["steps"] == data["steps"]
    after = subprocess.run(["git", "-C", str(target), "status", "--porcelain"], capture_output=True, text=True, check=False).stdout
    assert after == before
    bp = OpenCoreSaasReadinessEngine.audit_blueprint(REPO_ROOT)
    assert bp["synchronized"] is True and bp["matched_steps_count"] == 25
    for rel in (
        "src/core/opencore/grab_diagnostic_types.py", "src/core/opencore/grab_market_facts.py",
        "src/core/opencore/grab_probe_runner.py", "src/core/opencore/durian_export_steps_p1_p3.py",
        "src/core/opencore/durian_export_25_step_catalog.py", "src/core/opencore/archetype_catalog_registry.py",
        "src/core/opencore/grab_cross_repo_scanner.py", "src/core/opencore/phase_560_opencore_saas_readiness_engine.py",
        "src/cli/idea_commands.py", "tests/test_durian_grab_honest_diagnosis.py",
    ):
        assert sum(1 for _ in (REPO_ROOT / rel).open("r", encoding="utf-8")) <= 165, rel
