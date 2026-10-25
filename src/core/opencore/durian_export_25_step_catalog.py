"""Layers P4-P5 (Steps 16-25) and complete 25-step Durian Export Grab-standard catalog."""
from __future__ import annotations

from src.core.opencore.durian_export_steps_p1_p3 import DURIAN_STEPS_P1_TO_P3
from src.core.opencore.grab_diagnostic_types import (
    ArtifactSchema,
    EvidenceClass,
    GrepSymbol,
    ProductionCallerCount,
    ReadinessLevel,
    RuntimeExec,
    StepSpec,
)

DURIAN_STEPS_P4_TO_P5: tuple[StepSpec, ...] = (
    StepSpec(
        16, "P4_TRANSACTION_NETWORK", "verified-trade-room",
        "Closed verified B2B trade room gated behind PLATFORM-01 (>=3 paying packhouses)",
        EvidenceClass.STATIC_SOURCE,
        ProductionCallerCount(symbol="isMarketplaceFeatureUnlocked", min_callers=1),
        mandatory_prerequisites=("PLATFORM-01", "dense-mekong-cluster-readiness"),
    ),
    StepSpec(
        17, "P4_TRANSACTION_NETWORK", "zero-custody-compliance-guard",
        "Decree 52/2024/ND-CP zero-custody guard rejecting 7 prohibited financial keys",
        EvidenceClass.RUNTIME_BEHAVIOR,
        RuntimeExec(
            module_path="src/marketplace/marketplace-guard.ts",
            function_name="assertZeroCustodyCompliance",
            fixture_expr=(
                "(() => { try { assertZeroCustodyCompliance({ walletBalance: 100 }); return false; } "
                "catch (e) { return e.code === 'ZERO_CUSTODY_VIOLATION'; } })()"
            ),
            expected_basis="rejects walletBalance with ZERO_CUSTODY_VIOLATION",
        ),
        mandatory_prerequisites=("verified-trade-room",),
    ),
    StepSpec(
        18, "P4_TRANSACTION_NETWORK", "escrow-state-machine-no-custody",
        "Non-custodial bank escrow state machine gated behind PLATFORM-03",
        EvidenceClass.STATIC_SOURCE,
        GrepSymbol(symbol="NonCustodialEscrowCoordinator", min_occurrences=1, target_level=ReadinessLevel.GUARDED),
        mandatory_prerequisites=("PLATFORM-03", "zero-custody-compliance-guard"),
    ),
    StepSpec(
        19, "P4_TRANSACTION_NETWORK", "usage-metering-non-binding-take-rate",
        "Non-binding usage metering (isNonBindingEstimateOnly: true)",
        EvidenceClass.RUNTIME_BEHAVIOR,
        RuntimeExec(
            module_path="src/saas/usage-metering-service.ts",
            function_name="computeTenantUsageAndRoiReport",
            fixture_expr="computeTenantUsageAndRoiReport('t1', [], 'COMMUNITY_OPEN_CORE').isNonBindingEstimateOnly === true",
            expected_basis="enforces isNonBindingEstimateOnly === true",
        ),
        mandatory_prerequisites=("container-and-customs-seal-identity",),
    ),
    StepSpec(
        20, "P4_TRANSACTION_NETWORK", "no-public-marketplace-without-license",
        "NOT-AUTH-01 guard: no open unauthenticated public listing surface without MoIT license",
        EvidenceClass.STATIC_SOURCE,
        GrepSymbol(symbol="FEATURE_LOCKED_PENDING_PILOT_SIGN_OFF", min_occurrences=1, target_level=ReadinessLevel.GUARDED),
        mandatory_prerequisites=("organization-identity-and-roles",),
    ),
    StepSpec(
        21, "P5_REGIONAL_INFRASTRUCTURE", "local-first-loopback-and-audit-chain",
        "GATE-03 127.0.0.1 loopback + SHA-256 hash-chained AuditLedger integrity",
        EvidenceClass.RUNTIME_BEHAVIOR,
        RuntimeExec(
            module_path="src/audit/audit-ledger.ts",
            function_name="AuditLedger",
            fixture_expr=(
                "(() => { const l = new AuditLedger(); "
                "l.recordEvent({id:'u1',tenantId:'t1',role:'MANAGER',name:'M',tenantType:'PACKHOUSE_EXPORTER',persona:'PACKHOUSE_MANAGER'},"
                "'d1','TEST','DOSSIER','d1',null,{ok:true}); return l.verifyIntegrity() === true; })()"
            ),
            expected_basis="verifies SHA-256 audit hash chain integrity",
        ),
        mandatory_prerequisites=("organization-identity-and-roles",),
    ),
    StepSpec(
        22, "P5_REGIONAL_INFRASTRUCTURE", "asean-corridor-registry",
        "ASEAN corridor registry (VN_CN, MY_CN, TH_CN, PH_CN) with active engine consumer",
        EvidenceClass.STATIC_SOURCE,
        ProductionCallerCount(symbol="getAseanCorridorProtocol", min_callers=1),
        mandatory_prerequisites=("cadmium-heavy-metal-evaluator",),
    ),
    StepSpec(
        23, "P5_REGIONAL_INFRASTRUCTURE", "corridor-sequencing-integrity",
        "LATER-02/LATER-04 sequencing: MY_CN and TH_CN must not precede PUC registry & PLATFORM-03",
        EvidenceClass.STATIC_SOURCE,
        GrepSymbol(symbol="MY_CN", min_occurrences=1, target_level=ReadinessLevel.DECLARED),
        mandatory_prerequisites=("puc-orchard-registry", "accredited-lab-test-evidence", "PLATFORM-03"),
    ),
    StepSpec(
        24, "P5_REGIONAL_INFRASTRUCTURE", "multi-revenue-stack-arithmetic",
        "Recomputed economic ceiling: ceil(1M * 25,637 / 60M) = 428 > 281 packhouses",
        EvidenceClass.STATIC_SOURCE,
        ArtifactSchema(artifact_path="", schema_kind="recomputed_market_facts"),
        mandatory_prerequisites=("usage-metering-non-binding-take-rate",),
    ),
    StepSpec(
        25, "P5_REGIONAL_INFRASTRUCTURE", "model-portability-to-my",
        "HARD-KILL Malaysia portability proof (52 approved MY packhouses under MAFI-GACC 2024)",
        EvidenceClass.MARKET,
        ArtifactSchema(
            artifact_path="docs/pilot-readiness/malaysia-portability-validation.json",
            schema_kind="json",
            required_keys=("validated_packhouses_my", "mafi_gacc_protocol_verified"),
        ),
        mandatory_prerequisites=("corridor-sequencing-integrity", "multi-revenue-stack-arithmetic"),
    ),
)

TWENTY_FIVE_DURIAN_GRAB_STEPS: tuple[StepSpec, ...] = DURIAN_STEPS_P1_TO_P3 + DURIAN_STEPS_P4_TO_P5
