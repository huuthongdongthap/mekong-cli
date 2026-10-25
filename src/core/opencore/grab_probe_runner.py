"""Executes the six behavioral probe primitives against a target repository in read-only mode."""
from __future__ import annotations

import json
from pathlib import Path
import re
import shutil
import subprocess

from src.core.opencore.grab_diagnostic_types import (
    ArtifactSchema,
    AstTypePresent,
    CommandExit,
    EvidenceClass,
    GrepSymbol,
    ProbeDeclaration,
    ProductionCallerCount,
    ReadinessLabel,
    ReadinessLevel,
    RuntimeExec,
)
from src.core.opencore.grab_market_facts import recompute_saas_ceiling

ALLOWLISTED_RUNTIME_FUNCTIONS: frozenset[tuple[str, str]] = frozenset(
    {
        ("src/domain/iso-6346.ts", "validateIso6346Container"),
        ("src/rules/cadmium-evaluators.ts", "evaluateCadmiumThreshold"),
        ("src/marketplace/marketplace-guard.ts", "assertZeroCustodyCompliance"),
        ("src/marketplace/marketplace-guard.ts", "isMarketplaceFeatureUnlocked"),
        ("src/saas/usage-metering-service.ts", "computeTenantUsageAndRoiReport"),
        ("src/audit/audit-ledger.ts", "AuditLedger"),
    }
)


def _iter_source_files(target_root: Path, exclude_paths: tuple[str, ...]) -> list[Path]:
    src_dir = target_root / "src"
    if not src_dir.is_dir():
        return []
    excluded = {p.strip("/") for p in exclude_paths}
    files: list[Path] = []
    for path in sorted(src_dir.rglob("*")):
        if not path.is_file() or path.suffix not in (".ts", ".tsx", ".py"):
            continue
        rel = path.relative_to(target_root).as_posix()
        if any(rel == ex or rel.startswith(f"{ex}/") for ex in excluded):
            continue
        if "/test/" in f"/{rel}/" or rel.endswith((".test.ts", ".spec.ts")):
            continue
        files.append(path)
    return files


def _run_grep_symbol(probe: GrepSymbol, target_root: Path) -> ReadinessLabel:
    files = _iter_source_files(target_root, probe.exclude_paths)
    pattern = re.compile(rf"\b{re.escape(probe.symbol)}\b")
    hits = 0
    matched_files: list[str] = []
    for f in files:
        count = len(pattern.findall(f.read_text(encoding="utf-8", errors="ignore")))
        if count > 0:
            hits += count
            matched_files.append(f.relative_to(target_root).as_posix())
    if hits >= probe.min_occurrences:
        sample = matched_files[0] if matched_files else "src"
        return ReadinessLabel(probe.target_level, True, f"grep:{probe.symbol} hits={hits} ({sample})")
    if hits > 0:
        return ReadinessLabel(ReadinessLevel.DECLARED, True, f"grep:{probe.symbol} hits={hits}<{probe.min_occurrences}")
    return ReadinessLabel(ReadinessLevel.ABSENT, True, f"grep:{probe.symbol} hits=0 in src/")


def _run_ast_type(probe: AstTypePresent, target_root: Path) -> ReadinessLabel:
    files = _iter_source_files(target_root, ())
    corpus = "\n".join(f.read_text(encoding="utf-8", errors="ignore") for f in files)
    found: list[str] = []
    missing: list[str] = []
    for name in probe.type_names:
        decl_pat = re.compile(rf"\b(?:interface|type|class|enum)\s+{re.escape(name)}\b")
        (found if decl_pat.search(corpus) else missing).append(name)
    if not found:
        return ReadinessLabel(ReadinessLevel.ABSENT, True, f"ast:0/{len(probe.type_names)} types ({','.join(missing)})")
    if missing:
        return ReadinessLabel(ReadinessLevel.DECLARED, True, f"ast:present={','.join(found)} missing={','.join(missing)}")
    return ReadinessLabel(ReadinessLevel.IMPLEMENTED, True, f"ast:all_types_present={','.join(found)}")


def _run_prod_callers(probe: ProductionCallerCount, target_root: Path) -> ReadinessLabel:
    files = _iter_source_files(target_root, probe.exclude_paths)
    decl_pat = re.compile(rf"\b(?:export\s+)?(?:async\s+)?(?:function|class|const)\s+{re.escape(probe.symbol)}\b")
    call_pat = re.compile(rf"\b{re.escape(probe.symbol)}\s*\(")
    declared_in: list[str] = []
    caller_files: list[str] = []
    for f in files:
        text = f.read_text(encoding="utf-8", errors="ignore")
        rel = f.relative_to(target_root).as_posix()
        if decl_pat.search(text):
            declared_in.append(rel)
            continue
        if call_pat.search(text):
            caller_files.append(rel)
    if not declared_in and not caller_files:
        return ReadinessLabel(ReadinessLevel.ABSENT, True, f"callers:{probe.symbol} absent in src/")
    if len(caller_files) >= probe.min_callers:
        return ReadinessLabel(ReadinessLevel.REACHABLE, True, f"callers:{probe.symbol} prod_callers={len(caller_files)} ({caller_files[0]})")
    return ReadinessLabel(ReadinessLevel.IMPLEMENTED, True, f"callers:{probe.symbol} prod_callers={len(caller_files)}<{probe.min_callers} (rehearsal excluded)")


def _run_runtime_exec(probe: RuntimeExec, target_root: Path, execute_runtime: bool) -> ReadinessLabel:
    mod_file = target_root / probe.module_path
    if not mod_file.is_file():
        return ReadinessLabel(ReadinessLevel.ABSENT, True, f"runtime:{probe.module_path} missing")
    text = mod_file.read_text(encoding="utf-8", errors="ignore")
    if probe.function_name not in text:
        return ReadinessLabel(ReadinessLevel.DECLARED, True, f"runtime:{probe.function_name} missing in {probe.module_path}")
    if not execute_runtime or (probe.module_path, probe.function_name) not in ALLOWLISTED_RUNTIME_FUNCTIONS or shutil.which("bun") is None:
        return ReadinessLabel(ReadinessLevel.GUARDED, True, f"runtime:no-execute static_verified({probe.module_path}:{probe.function_name})")
    script = f"import {{ {probe.function_name} }} from './{probe.module_path}'; if (!({probe.fixture_expr})) process.exit(2);"
    proc = subprocess.run(["bun", "-e", script], cwd=str(target_root), capture_output=True, text=True, check=False, timeout=10)
    if proc.returncode == 0:
        return ReadinessLabel(ReadinessLevel.MEASURED, True, f"bun -e ({probe.module_path}:{probe.function_name}) -> {probe.expected_basis}")
    return ReadinessLabel(ReadinessLevel.GUARDED, True, f"runtime:exit={proc.returncode} ({probe.module_path}:{probe.function_name})")


def _run_artifact_schema(probe: ArtifactSchema, evidence_class: EvidenceClass, target_root: Path) -> ReadinessLabel:
    if probe.schema_kind == "recomputed_market_facts":
        req_sites, feasible = recompute_saas_ceiling()
        return ReadinessLabel(ReadinessLevel.MEASURED, True, f"recomputed:sites_for_1m={req_sites}>281 saas_only_feasible={feasible}")
    art_path = target_root / probe.artifact_path
    if not art_path.is_file():
        if evidence_class in (EvidenceClass.MARKET, EvidenceClass.LIVE_OPERATION):
            return ReadinessLabel(ReadinessLevel.ABSENT, False, f"unmeasurable:missing_live_artifact({probe.artifact_path})")
        return ReadinessLabel(ReadinessLevel.ABSENT, True, f"artifact:missing({probe.artifact_path})")
    data = json.loads(art_path.read_text(encoding="utf-8"))
    missing_keys = [k for k in probe.required_keys if k not in data]
    null_violations = [k for k in probe.require_non_null if data.get(k) is None]
    eq_violations = [k for k, v in probe.expected_equals.items() if data.get(k) != v]
    if missing_keys or null_violations or eq_violations:
        if evidence_class in (EvidenceClass.MARKET, EvidenceClass.LIVE_OPERATION):
            return ReadinessLabel(ReadinessLevel.DECLARED, False, f"unmeasurable:draft_or_incomplete({probe.artifact_path}:null={null_violations},mismatch={eq_violations})")
        return ReadinessLabel(ReadinessLevel.DECLARED, True, f"artifact:schema_incomplete({probe.artifact_path})")
    return ReadinessLabel(ReadinessLevel.MEASURED, True, f"artifact:verified({probe.artifact_path})")


def execute_probe(probe: ProbeDeclaration, evidence_class: EvidenceClass, target_root: Path, execute_runtime: bool = True) -> ReadinessLabel:
    if isinstance(probe, GrepSymbol):
        return _run_grep_symbol(probe, target_root)
    if isinstance(probe, AstTypePresent):
        return _run_ast_type(probe, target_root)
    if isinstance(probe, ProductionCallerCount):
        return _run_prod_callers(probe, target_root)
    if isinstance(probe, RuntimeExec):
        return _run_runtime_exec(probe, target_root, execute_runtime)
    if isinstance(probe, ArtifactSchema):
        return _run_artifact_schema(probe, evidence_class, target_root)
    if isinstance(probe, CommandExit):
        proc = subprocess.run(list(probe.argv), cwd=str(target_root / probe.cwd_relative), capture_output=True, text=True, check=False, timeout=20)
        lvl = ReadinessLevel.MEASURED if proc.returncode == 0 else ReadinessLevel.DECLARED
        return ReadinessLabel(lvl, True, f"cmd:{probe.command} exit={proc.returncode}")
    return ReadinessLabel(ReadinessLevel.ABSENT, False, "unknown_probe")
