#!/usr/bin/env bash
set -euo pipefail
echo "===== LOSKOT VERIFY MEGA PACK N ====="
test -f PROJECT_STATE_UNIFIED.md
test -f CHANGELOG.md
if git diff --name-only | grep -E '^(package\.json|package-lock\.json)$' >/dev/null 2>&1; then echo "ERROR: package changed"; exit 1; fi
if git diff --name-only | grep -Ei '(^|/)(preview|index|app).*\.(html)$' >/dev/null 2>&1; then echo "ERROR: preview/html changed"; exit 1; fi
for f in src/runtime/v131_v135_collaboration_handoff_review_engine/*.js; do node --check "$f"; done
node --check tests/runtime/v131_v135_collaboration_handoff_review_smoke_test.js
node tests/runtime/v131_v135_collaboration_handoff_review_smoke_test.js
git diff --check
echo "===== LOSKOT RESULT ====="
echo "VERIFY=0"
echo "DIFFCHECK=0"
echo "SMOKE=0"
echo "STATUS=OK"
echo "========================="
