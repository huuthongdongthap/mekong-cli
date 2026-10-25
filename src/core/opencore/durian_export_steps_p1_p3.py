"""Layers P1-P3 (Steps 1-15) of the 25-step Durian Export Grab-standard diagnostic catalog."""
from __future__ import annotations

from src.core.opencore.grab_diagnostic_types import (
    ArtifactSchema,
    AstTypePresent,
    EvidenceClass,
    GrepSymbol,
    ProductionCallerCount,
    ReadinessLevel,
    RuntimeExec,
    StepSpec,
)

DURIAN_STEPS_P1_TO_P3: tuple[StepSpec, ...] = (
    StepSpec(
        1, "P1_SYSTEM_OF_RECORD", "organization-identity-and-roles",
        "GACC registered legal exporter entity + RBAC roles",
        EvidenceClass.STATIC_SOURCE,
        AstTypePresent(type_names=("AuthenticatedActor", "TenantType", "Organization", "Permission")),
    ),
    StepSpec(
        2, "P1_SYSTEM_OF_RECORD", "puc-orchard-registry",
        "MARD-issued Production Unit Code (PUC, 1,599 orchards) entity",
        EvidenceClass.STATIC_SOURCE,
        GrepSymbol(symbol="ProductionSource", min_occurrences=1),
        mandatory_prerequisites=("organization-identity-and-roles",),
    ),
    StepSpec(
        3, "P1_SYSTEM_OF_RECORD", "packhouse-site-consent",
        "Active packhouse registry (281 PHCs) + signed GATE-01 site DPA (Law 91/2025/QH15)",
        EvidenceClass.LIVE_OPERATION,
        ArtifactSchema(
            artifact_path="docs/product-direction/DURIOS-STRATEGY-V2.json",
            schema_kind="json",
            required_keys=("approval_status", "approved_by"),
            require_non_null=("approved_by",),
        ),
        mandatory_prerequisites=("organization-identity-and-roles",),
    ),
    StepSpec(
        4, "P1_SYSTEM_OF_RECORD", "lot-lineage-atomic-unit",
        "Atomic Lot lineage binding PUC orchard harvest to container dossier",
        EvidenceClass.STATIC_SOURCE,
        AstTypePresent(type_names=("ContainerDossier", "Lot")),
        mandatory_prerequisites=("puc-orchard-registry",),
    ),
    StepSpec(
        5, "P1_SYSTEM_OF_RECORD", "container-and-customs-seal-identity",
        "ISO 6346 container check-digit + customs seal identity",
        EvidenceClass.RUNTIME_BEHAVIOR,
        RuntimeExec(
            module_path="src/domain/iso-6346.ts",
            function_name="validateIso6346Container",
            fixture_expr="validateIso6346Container('CSQU3054383').isValid === true && validateIso6346Container('CSQU3054380').isValid === false",
            expected_basis="validates ISO 6346 check digit",
        ),
        mandatory_prerequisites=("organization-identity-and-roles",),
    ),
    StepSpec(
        6, "P2_SYSTEM_OF_VERIFICATION", "cadmium-heavy-metal-evaluator",
        "Deterministic 0.050 mg/kg cadmium internal food-safety blocker (H4 fail-closed)",
        EvidenceClass.RUNTIME_BEHAVIOR,
        RuntimeExec(
            module_path="src/rules/cadmium-evaluators.ts",
            function_name="evaluateCadmiumThreshold",
            fixture_expr=(
                "(() => { const f = []; evaluateCadmiumThreshold("
                "{ruleId:'R1',name:'Cd',severity:'CRITICAL_BLOCKER',description:'',governingAuthority:'',"
                "statutoryReference:'GB2762',isActive:true,isStatutoryVerified:false,evaluationType:'NUMERIC_THRESHOLD'},"
                "[{id:'d1',dossierId:'x',tenantId:'t',documentType:'LAB_TEST_REPORT',fileName:'a',fileSize:1,mimeType:'text/plain',"
                "sha256Hash:'h',uploadedAt:'2026-01-01',isSuperseded:false,extractedFields:[{id:'f1',documentId:'d1',"
                "fieldKey:'cadmium_mg_kg',label:'Cd',rawValue:'0.300',normalizedValue:0.3,confidenceScore:1,"
                "boundingBox:{pageNumber:1,x:0,y:0,width:1,height:1},verificationStatus:'HUMAN_VERIFIED'}]}], f);"
                "return f.length === 1 && f[0].severity === 'CRITICAL_BLOCKER'; })()"
            ),
            expected_basis="blocks 0.300 mg/kg > 0.050 mg/kg",
        ),
        mandatory_prerequisites=("container-and-customs-seal-identity",),
    ),
    StepSpec(
        7, "P2_SYSTEM_OF_VERIFICATION", "accredited-lab-test-evidence",
        "Accredited/registered lab TestEvidence entity bound to ISO 17025 lab identity",
        EvidenceClass.STATIC_SOURCE,
        GrepSymbol(symbol="TestEvidence", min_occurrences=1),
        mandatory_prerequisites=("cadmium-heavy-metal-evaluator",),
    ),
    StepSpec(
        8, "P2_SYSTEM_OF_VERIFICATION", "phytosanitary-certificate-object",
        "NPPO / PPD-VN Phytosanitary Certificate document & cross-document check",
        EvidenceClass.STATIC_SOURCE,
        GrepSymbol(symbol="PHYTOSANITARY_CERTIFICATE", min_occurrences=2, target_level=ReadinessLevel.GUARDED),
        mandatory_prerequisites=("container-and-customs-seal-identity",),
    ),
    StepSpec(
        9, "P2_SYSTEM_OF_VERIFICATION", "cold-chain-temperature-attestation",
        "Continuous pre-cooling & transit temperature (12-15 C) evaluator",
        EvidenceClass.STATIC_SOURCE,
        ProductionCallerCount(symbol="minTemperatureC", min_callers=1),
        mandatory_prerequisites=("container-and-customs-seal-identity",),
    ),
    StepSpec(
        10, "P2_SYSTEM_OF_VERIFICATION", "blind-fault-exception-and-5min-mean",
        "GATE-05 N=5 container blind-fault catch rate = 100% and mean reconciliation < 5 min",
        EvidenceClass.LIVE_OPERATION,
        ArtifactSchema(
            artifact_path="docs/pilot-readiness/n5-blind-rehearsal-report.json",
            schema_kind="json",
            required_keys=("containers_tested", "aggregation_method", "mean_reconciliation_minutes"),
            expected_equals={"containers_tested": 5, "aggregation_method": "mean"},
        ),
        mandatory_prerequisites=("cadmium-heavy-metal-evaluator",),
    ),
    StepSpec(
        11, "P3_CLOSED_NETWORK", "verified-organization-profile",
        "VerifiedOrganizationProfile with documentReliabilityScore",
        EvidenceClass.STATIC_SOURCE,
        ProductionCallerCount(symbol="compileVerifiedOrganizationProfile", min_callers=1),
        mandatory_prerequisites=("cadmium-heavy-metal-evaluator",),
    ),
    StepSpec(
        12, "P3_CLOSED_NETWORK", "selective-disclosure-share-grant",
        "Selective disclosure share grant hiding orchard supplier & farmgate price",
        EvidenceClass.STATIC_SOURCE,
        GrepSymbol(symbol="selectiveDisclosure", min_occurrences=1),
        mandatory_prerequisites=("verified-organization-profile",),
    ),
    StepSpec(
        13, "P3_CLOSED_NETWORK", "federated-trust-handshake",
        "NEXT-03 cryptographic cross-organization federated trust verification",
        EvidenceClass.STATIC_SOURCE,
        ProductionCallerCount(symbol="issueCrossBorderBuyerVerificationRoom", min_callers=1),
        mandatory_prerequisites=("verified-organization-profile", "blind-fault-exception-and-5min-mean"),
    ),
    StepSpec(
        14, "P3_CLOSED_NETWORK", "gacc-registry-watch",
        "Live GACC PUC/PHC suspension & revocation watch wired to production routes",
        EvidenceClass.STATIC_SOURCE,
        ProductionCallerCount(symbol="evaluateGaccRegistryWatch", min_callers=1),
        mandatory_prerequisites=("puc-orchard-registry",),
    ),
    StepSpec(
        15, "P3_CLOSED_NETWORK", "dense-mekong-cluster-readiness",
        "Mekong Delta cluster network density (8 packhouses + 3 exporters + 2 labs)",
        EvidenceClass.MARKET,
        ArtifactSchema(
            artifact_path="docs/pilot-readiness/mekong-cluster-density.json",
            schema_kind="json",
            required_keys=("active_packhouses", "active_exporters", "accredited_labs"),
        ),
        mandatory_prerequisites=("packhouse-site-consent", "blind-fault-exception-and-5min-mean"),
    ),
)
