#!/usr/bin/env bash
set -u
LOG_DIR="dist/verify"
LOG_FILE="$LOG_DIR/v48_fve_cad_app_connector_verify.log"
mkdir -p "$LOG_DIR"
: > "$LOG_FILE"
FAIL=0
DIFFCHECK=0
run_and_capture() {
  local name="$1"
  shift
  echo "" | tee -a "$LOG_FILE"
  echo "=== RUN $name ===" | tee -a "$LOG_FILE"
  "$@" 2>&1 | tee -a "$LOG_FILE"
  local code=${PIPESTATUS[0]}
  echo "=== EXIT $name = $code ===" | tee -a "$LOG_FILE"
  if [ "$code" -ne 0 ]; then FAIL=1; fi
}
print_result() {
  local branch="unknown"
  local head="unknown"
  local status_rows="0"
  branch=$(git branch --show-current 2>/dev/null || echo "unknown")
  head=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
  status_rows=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  echo ""
  echo "===== LOSKOT RESULT ====="
  echo "BRANCH=$branch"
  echo "VERIFY=$FAIL"
  echo "DIFFCHECK=$DIFFCHECK"
  echo "MERGE=NA"
  echo "PUSH=NA"
  echo "HEAD=$head"
  echo "STATUS=$status_rows uncommitted/untracked rows"
  echo "========================="
}
echo "=== VERIFY v48 FVE CAD APP CONNECTOR ===" | tee -a "$LOG_FILE"
run_and_capture "v47:fveCadDomBinding" bash scripts/verify/verify_v47_fve_cad_dom_binding.sh
run_and_capture "scan:v48:app-entrypoints" node scripts/verify/v48_scan_app_entrypoints.mjs
run_and_capture "check:runtime:fveCadAppConnector" node --check src/runtime/fveCadAppConnector.js
run_and_capture "check:runtime:index" node --check src/runtime/index.js
run_and_capture "check:runtime:v48test" node --check tests/runtime/v48_fve_cad_app_connector_smoke_test.js
run_and_capture "test:runtime:v48" node tests/runtime/v48_fve_cad_app_connector_smoke_test.js

echo "" | tee -a "$LOG_FILE"
echo "=== PACKAGE GUARD ===" | tee -a "$LOG_FILE"
if git diff --name-only | grep -E "^package(-lock)?\.json$" > "$LOG_DIR/v48_package_guard.log"; then
  echo "ERROR: v48 nesmí měnit package.json ani package-lock.json" | tee -a "$LOG_FILE"
  cat "$LOG_DIR/v48_package_guard.log" | tee -a "$LOG_FILE"
  FAIL=1
else
  echo "OK: package guard čistý" | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"
echo "=== STRICT LOG SCAN v48 ===" | tee -a "$LOG_FILE"
STRICT_PATTERNS="test failed|Test Failed|FAILED|Some smoke tests failed|TypeError|ReferenceError|SyntaxError|ERR_MODULE_NOT_FOUND|Cannot read properties|is not a function|is not defined|ERROR:"
if grep -Ein "$STRICT_PATTERNS" "$LOG_FILE" > "$LOG_DIR/v48_fve_cad_app_connector_errors.log"; then
  echo "ERROR: v48 strict scan našel chyby:" | tee -a "$LOG_FILE"
  cat "$LOG_DIR/v48_fve_cad_app_connector_errors.log" | tee -a "$LOG_FILE"
  FAIL=1
else
  echo "OK: v48 strict scan bez chybových textů" | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"
echo "=== DIFF CHECK ===" | tee -a "$LOG_FILE"
git diff --check 2>&1 | tee -a "$LOG_FILE"
DIFFCHECK=${PIPESTATUS[0]}
if [ "$DIFFCHECK" -ne 0 ]; then FAIL=1; fi

if [ "$FAIL" -eq 0 ]; then
  echo "OK: v48 FVE CAD app connector verify prošel čistě" | tee -a "$LOG_FILE"
else
  echo "ERROR: v48 FVE CAD app connector verify selhal" | tee -a "$LOG_FILE"
fi

print_result | tee -a "$LOG_FILE"
exit "$FAIL"
