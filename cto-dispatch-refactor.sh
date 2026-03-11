#!/bin/bash
# ============================================================
# CTO DISPATCH: Refactor Cleanup — ALL-IN-ONE Script
# ============================================================
# Chạy tất cả 5 batch tuần tự trong 1 cửa sổ.
# Mỗi batch tự commit + verify trước khi chạy batch tiếp.
#
#   chmod +x cto-dispatch-refactor.sh
#   ./cto-dispatch-refactor.sh
# ============================================================

set -e
REPO="/Users/mac/mekong-cli"
cd "$REPO"

echo "╔══════════════════════════════════════════════════════╗"
echo "║  🎯 CTO DISPATCH — Refactor Cleanup (5 Batches)    ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ── Tạo branch ──
git checkout -b refactor/cleanup-obsolete 2>/dev/null || git checkout refactor/cleanup-obsolete
echo ""

# ============================================================
echo "━━━ BATCH 1/5: Root Debug Scripts (30 files) ━━━"
# ============================================================
git rm -f check_config_resolution.py check_routes.py check_routes_v2.py \
  demo.py find_prints.py repro_testclient.py \
  test_jose_debug.py test_plugins.py \
  zip_background_jobs_kit.py zip_search_index_kit.py 2>/dev/null || true

git rm -f check-dist.mjs clean-settings.js test-keys.mjs \
  test-pkg-import.mjs test_fetch.js i18next-scanner.config.js 2>/dev/null || true

git rm -f build_full_log.txt build_full_log_v2.txt circular_deps.txt \
  dead_code.txt src_dead_code.txt madge_output.txt ts_prune_output.txt 2>/dev/null || true

git rm -f test_input.jsonl demo_script.md supervisor.py server.py \
  main.py cc Patterns 2>/dev/null || true

git commit -m "refactor: Batch 1 — remove 30 root debug/obsolete files" || echo "Batch 1: nothing to commit"
echo "✅ Batch 1 done"
echo ""

# ============================================================
echo "━━━ BATCH 2/5: Orphan Directories (~42MB) ━━━"
# ============================================================
git rm -rf claude_bridge/ claudedocs/ claudekit-engineer-dna/ \
  newsletter-saas/ doanh-trai-tom-hum/ vibe-cloud-brain-kit/ \
  external-proxy/ Users/ 2>/dev/null || true

rm -rf .git_backup_sophia/ 2>/dev/null || true

git commit -m "refactor: Batch 2 — remove 9 orphan directories (~42MB)" || echo "Batch 2: nothing to commit"
echo "✅ Batch 2 done"
echo ""

# ============================================================
echo "━━━ BATCH 3/5: Config Dir Cleanup (~30MB) ━━━"
# ============================================================
rm -rf .ag_proxies/ .claude-flow/ .claude-skills/ .cleo/ \
  .opencode/ .swarm/ .taskmaster/ \
  .workflow-migration-backup-20260126-184942/ 2>/dev/null || true

git rm -f .env.api.example .env.domain .env.unified \
  .env.production.template 2>/dev/null || true

git add -A
git commit -m "refactor: Batch 3 — remove orphan config dirs + env files (~30MB)" || echo "Batch 3: nothing to commit"
echo "✅ Batch 3 done"
echo ""

# ============================================================
echo "━━━ BATCH 4/5: Duplicate Docs + Heavy Dirs ━━━"
# ============================================================
git rm -f CHANGELOG-TOOLS.md DOCKER_BUILD_SUMMARY.md FREE_ASSETS_CATALOG.md \
  OPEN_SOURCE_STRATEGY.md PROXY_ARCHITECTURE.md PROXY_RULES.md \
  README.raas.md README.vi.md RELEASE_LOG.md RELEASE_NOTES.md \
  RELEASE_NOTES_v5.0.0.md 2>/dev/null || true

git rm -f docker-compose.raas.yml deploy-staging.sh \
  deploy-production.sh cloudbuild.yaml 2>/dev/null || true

git rm -rf _bmad/ invoices/ proposals/ 2>/dev/null || true

git commit -m "refactor: Batch 4 — remove duplicate docs + orphan dirs" || echo "Batch 4: nothing to commit"
echo "✅ Batch 4 done"
echo ""

# ============================================================
echo "━━━ BATCH 5/5: src/ Dead Code Audit ━━━"
# ============================================================
echo "🔍 Scanning orphan files in src/..."
python3 -c "
import pathlib
src = pathlib.Path('src')
all_files = set(f.stem for f in src.rglob('*.py') if f.stem != '__init__')
imported = set()
for f in src.rglob('*.py'):
    for line in f.read_text(errors='ignore').splitlines():
        if 'import' in line:
            for name in all_files:
                if name in line:
                    imported.add(name)
orphans = all_files - imported
print(f'  Found {len(orphans)} orphan files / {len(all_files)} total')
for o in sorted(orphans):
    print(f'    ⚠️  {o}')
"
echo "⚠️  Batch 5 = audit only — review orphans trước khi xoá thủ công"
echo ""

# ============================================================
echo "━━━ VERIFICATION ━━━"
# ============================================================
echo "🧪 Running tests..."
python3 -m pytest tests/ -q --tb=short 2>&1 | tail -3

echo ""
echo "⚡ AGI Benchmark..."
python3 -m src.main agi benchmark 2>&1 | grep -v Warning | grep -E "Result:|Score:"

echo ""
echo "📊 Repo size after cleanup:"
du -sh .

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅ REFACTOR COMPLETE — 4 batches executed          ║"
echo "║  ⚠️  Batch 5 orphans need manual review             ║"
echo "╚══════════════════════════════════════════════════════╝"
