#!/usr/bin/env bash
set -euo pipefail

echo "===== LOSKOT VERIFY V74-V85 CLASSIC PRO UI BINDING ====="

if [ ! -f "PROJECT_STATE_UNIFIED.md" ]; then
  echo "ERROR: PROJECT_STATE_UNIFIED.md not found. Run from repo root."
  exit 1
fi

if [ ! -f "CHANGELOG.md" ]; then
  echo "ERROR: CHANGELOG.md not found. Run from repo root."
  exit 1
fi

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
node --check src/runtime/v74v85/dashboardViewModelV74.js
node --check src/runtime/v74v85/qaPanelViewModelV74.js
node --check src/runtime/v74v85/projectInspectorViewModelV74.js
node --check src/runtime/v74v85/cadLayerViewModelV74.js
node --check src/runtime/v74v85/documentExportViewModelV74.js
node --check src/runtime/v74v85/classicProAppShellV74.js
node --check src/runtime/v74v85/index.js

echo "[4/8] node --check smoke"
node --check tests/runtime/v74_v85_classic_pro_ui_binding_smoke_test.js

echo "[5/8] smoke test"
node tests/runtime/v74_v85_classic_pro_ui_binding_smoke_test.js

echo "[6/8] strict grep"
if grep -RInE "TypeError|ReferenceError|SyntaxError|FAILED|test failed|is not a function|is not defined|ERR_MODULE_NOT_FOUND|Cannot read properties|AssertionError|command failed" \
  src/runtime/v74v85 tests/runtime/v74_v85_classic_pro_ui_binding_smoke_test.js 2>/dev/null; then
  echo "ERROR: strict grep found forbidden text"
  exit 1
fi

echo "[7/8] white screen guard marker"
grep -RIn "noWhiteScreenGuard" src/runtime/v74v85 >/dev/null

echo "[8/8] git diff --check"
git diff --check

echo "===== LOSKOT RESULT ====="
echo "VERIFY=0"
echo "DIFFCHECK=0"
echo "SMOKE=0"
echo "STATUS=OK"
echo "========================="
