#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="/Users/mac/mekong-cli/PTP Tech"
CODE_ROOT="$PROJECT_ROOT/ptp-tech"
MEKONG_ROOT="/Users/mac/mekong-cli"
REGISTRY="$MEKONG_ROOT/.codex/commands/registry.json"

MODE="check"
STEP="all"

usage() {
  cat <<'EOF'
Usage:
  scripts/ptp-mekong-auto.sh [--check|--execute|--auto] [step]

Steps:
  step1-context    Khoi dong va context
  step2-strategy   Chien luoc Founder layer
  step3-build      Xay dung san pham Engineering layer
  step4-business   Kinh doanh Business layer
  step5-ops        Van hanh Ops layer
  daily            Daily workflow
  weekly           Weekly sprint workflow
  top10            10 commands quan trong nhat
  all              step1-context..step5-ops

Default mode is --check, which resolves commands with --invocation --check.
Use --execute or --auto only when you want to run the Mekong commands.
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --check) MODE="check" ;;
    --execute) MODE="execute" ;;
    --auto) MODE="execute" ;;
    -h|--help) usage; exit 0 ;;
    *) STEP="$1" ;;
  esac
  shift
done

canonical() {
  case "$1" in
    context:prime) echo "context/prime" ;;
    venture:five-factors) echo "venture-five-factors" ;;
    venture:terrain) echo "venture-terrain" ;;
    venture:momentum) echo "venture-momentum" ;;
    venture:void-substance) echo "venture-void-substance" ;;
    ok) echo "founder-okr" ;;
    fix) echo "dev-debug" ;;
    plan/hard) echo "plan" ;;
    sync-all) echo "ops-sync-all" ;;
    studio:sprint:weekly) echo "pm-sprint" ;;
    general-report) echo "business-report" ;;
    fundraise) echo "founder-raise" ;;
    financial-model) echo "finance-budget-plan" ;;
    forecast) echo "sales-forecast" ;;
    pricing) echo "intl-pricing" ;;
    competitor) echo "pm-competitor" ;;
    roadmap) echo "pm-roadmap" ;;
    feedback) echo "pm-feedback" ;;
    refactor) echo "dev-refactor" ;;
    *) echo "$1" ;;
  esac
}

registry_has() {
  python3 - "$REGISTRY" "$1" <<'PY'
import json, sys
registry, command = sys.argv[1], sys.argv[2]
data = json.load(open(registry))
ids = {item["id"] for item in data["commands"]}
slashes = {item["slash"].lstrip("/") for item in data["commands"]}
sys.exit(0 if command in ids or command in slashes else 1)
PY
}

run_mekong() {
  local cwd="$1"
  local raw="$2"
  local args="${3:-}"
  local cmd
  cmd="$(canonical "$raw")"

  printf '\n[%s] %s%s\n' "$MODE" "$cmd" "${args:+ $args}"

  if [ "$cmd" = "status" ] || [ "$cmd" = "health" ]; then
    if [ "$MODE" = "check" ]; then
      (cd "$cwd" && mekong "$cmd" --help >/dev/null 2>&1 || mekong "$cmd" --invocation --check)
    else
      (cd "$cwd" && mekong "$cmd")
    fi
    return
  fi

  if ! registry_has "$cmd"; then
    printf 'SKIP missing registry command: %s\n' "$cmd" >&2
    return 2
  fi

  if [ "$MODE" = "check" ]; then
    if [ -n "$args" ]; then
      (cd "$cwd" && mekong codex-command "/$cmd" "$args" --invocation --check)
    else
      (cd "$cwd" && mekong codex-command "/$cmd" --invocation --check)
    fi
  else
    (cd "$cwd" && mekong "$cmd" ${args:+"$args"})
  fi
}

step1_context() {
  run_mekong "$PROJECT_ROOT" status || true
  run_mekong "$PROJECT_ROOT" health || true
  run_mekong "$PROJECT_ROOT" context:prime
}

step2_strategy() {
  run_mekong "$PROJECT_ROOT" venture:five-factors
  run_mekong "$PROJECT_ROOT" venture:terrain
  run_mekong "$PROJECT_ROOT" venture:momentum
  run_mekong "$PROJECT_ROOT" venture:void-substance
  run_mekong "$PROJECT_ROOT" founder-okr
}

step3_build() {
  run_mekong "$CODE_ROOT" plan "PTP Tech next website/product implementation plan"
  run_mekong "$CODE_ROOT" review
  run_mekong "$CODE_ROOT" test
}

step4_business() {
  run_mekong "$PROJECT_ROOT" marketing-campaign-run
  run_mekong "$PROJECT_ROOT" marketing-content-engine
  run_mekong "$PROJECT_ROOT" sales-pipeline-build
  run_mekong "$PROJECT_ROOT" finance-budget-plan
  run_mekong "$PROJECT_ROOT" ck-marketing-seo
}

step5_ops() {
  run_mekong "$PROJECT_ROOT" ops-health-sweep
  run_mekong "$PROJECT_ROOT" daily
  run_mekong "$PROJECT_ROOT" cto-dashboard
  run_mekong "$PROJECT_ROOT" ops-security-audit
  run_mekong "$PROJECT_ROOT" production-status
}

daily() {
  run_mekong "$PROJECT_ROOT" daily
  run_mekong "$PROJECT_ROOT" ops-health-sweep
  run_mekong "$PROJECT_ROOT" cto-dashboard
}

weekly() {
  run_mekong "$PROJECT_ROOT" pm-sprint
  run_mekong "$PROJECT_ROOT" portfolio-status
  run_mekong "$PROJECT_ROOT" business-report
}

top10() {
  run_mekong "$PROJECT_ROOT" cook "PTP Tech priority feature"
  run_mekong "$CODE_ROOT" deploy
  run_mekong "$CODE_ROOT" ship
  run_mekong "$PROJECT_ROOT" fix "PTP Tech runtime error"
  run_mekong "$PROJECT_ROOT" plan/hard "PTP Tech implementation task"
  run_mekong "$PROJECT_ROOT" daily
  run_mekong "$PROJECT_ROOT" marketing-campaign-run
  run_mekong "$PROJECT_ROOT" ops-health-sweep
  run_mekong "$PROJECT_ROOT" finance-budget-plan
  run_mekong "$CODE_ROOT" review
}

case "$STEP" in
  step1-context) step1_context ;;
  step2-strategy) step2_strategy ;;
  step3-build) step3_build ;;
  step4-business) step4_business ;;
  step5-ops) step5_ops ;;
  daily) daily ;;
  weekly) weekly ;;
  top10) top10 ;;
  all)
    step1_context
    step2_strategy
    step3_build
    step4_business
    step5_ops
    ;;
  *)
    usage >&2
    exit 64
    ;;
esac
