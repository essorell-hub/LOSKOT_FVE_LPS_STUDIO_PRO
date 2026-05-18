#!/usr/bin/env bash
set -euo pipefail

echo "===== LOSKOT VERIFY V86-V90 CAD MAP DEEP INTEGRATION ====="

test -f PROJECT_STATE_UNIFIED.md
test -f CHANGELOG.md

echo "[1/8] package guard"
if git diff --name-only | grep -E '^(package\.json|package-lock\.json)$' >/dev/null 2>&1; then
  echo "ERROR: package.json/package-lock.json changed"
  exit 1
fi

echo "[2/8] preview/html guard"
if git diff --name-only | grep -Ei '(^|/)(preview|index|app).*\.(html)$' >/dev/null 2>&1; then
  echo "ERROR: preview/html changed"
  exit 1
fi

echo "[3/8] node --check runtime"
node --check src/runtime/v86v90/cadObjectRegistryV86.js
node --check src/runtime/v86v90/cadSelectionEngineV86.js
node --check src/runtime/v86v90/cadDataLinkResolverV86.js
node --check src/runtime/v86v90/cadLayerManagerV86.js
node --check src/runtime/v86v90/cadQaHighlightMapperV86.js
node --check src/runtime/v86v90/cadMapBridgeV86.js
node --check src/runtime/v86v90/index.js

echo "[4/8] node --check smoke"
node --check tests/runtime/v86_v90_cad_map_deep_integration_smoke_test.js

echo "[5/8] smoke test"
node tests/runtime/v86_v90_cad_map_deep_integration_smoke_test.js

echo "[6/8] strict grep"
if grep -RInE "TypeError|ReferenceError|SyntaxError|FAILED|test failed|is not a function|is not defined|ERR_MODULE_NOT_FOUND|Cannot read properties|AssertionError|command failed" \
  src/runtime/v86v90 tests/runtime/v86_v90_cad_map_deep_integration_smoke_test.js 2>/dev/null; then
  echo "ERROR: strict grep found forbidden text"
  exit 1
fi

echo "[7/8] cad guards"
grep -RIn "linkedTable\\|linkedId\\|blocksExport" src/runtime/v86v90 >/dev/null

echo "[8/8] git diff --check"
git diff --check

echo "===== LOSKOT RESULT ====="
echo "VERIFY=0"
echo "DIFFCHECK=0"
echo "SMOKE=0"
echo "STATUS=OK"
echo "========================="
