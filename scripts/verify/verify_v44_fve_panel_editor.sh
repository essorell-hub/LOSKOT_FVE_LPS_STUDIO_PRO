#!/usr/bin/env bash
set -u
LOG_DIR="dist/verify"
LOG_FILE="$LOG_DIR/v44_fve_panel_editor_verify.log"
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
echo "=== VERIFY v44 FVE PANEL EDITOR ===" | tee -a "$LOG_FILE"
run_and_capture "v43:safeRuntimeBootstrap" bash scripts/verify/verify_v43_safe_runtime_bootstrap.sh
run_and_capture "check:runtime:fvePanelEditor" node --check src/runtime/fvePanelEditor.js
run_and_capture "check:runtime:index" node --check src/runtime/index.js
run_and_capture "check:runtime:v44test" node --check tests/runtime/v44_fve_panel_editor_smoke_test.js
run_and_capture "test:runtime:v44" node tests/runtime/v44_fve_panel_editor_smoke_test.js

echo "" | tee -a "$LOG_FILE"
echo "=== PACKAGE GUARD ===" | tee -a "$LOG_FILE"
if git diff --name-only | grep -E "^package(-lock)?\.json$" > "$LOG_DIR/v44_package_guard.log"; then
  echo "ERROR: v44 nesmí měnit package.json ani package-lock.json" | tee -a "$LOG_FILE"
  cat "$LOG_DIR/v44_package_guard.log" | tee -a "$LOG_FILE"
  FAIL=1
else
  echo "OK: package guard čistý" | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"
echo "=== STRICT LOG SCAN v44 ===" | tee -a "$LOG_FILE"
STRICT_PATTERNS="test failed|Test Failed|FAILED|Some smoke tests failed|TypeError|ReferenceError|SyntaxError|ERR_MODULE_NOT_FOUND|Cannot read properties|is not a function|is not defined|ERROR:"
if grep -Ein "$STRICT_PATTERNS" "$LOG_FILE" > "$LOG_DIR/v44_fve_panel_editor_errors.log"; then
  echo "ERROR: v44 strict scan našel chyby:" | tee -a "$LOG_FILE"
  cat "$LOG_DIR/v44_fve_panel_editor_errors.log" | tee -a "$LOG_FILE"
  FAIL=1
else
  echo "OK: v44 strict scan bez chybových textů" | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"
echo "=== DIFF CHECK ===" | tee -a "$LOG_FILE"
git diff --check 2>&1 | tee -a "$LOG_FILE"
DIFFCHECK=${PIPESTATUS[0]}
if [ "$DIFFCHECK" -ne 0 ]; then FAIL=1; fi

if [ "$FAIL" -eq 0 ]; then
  echo "OK: v44 FVE panel editor verify prošel čistě" | tee -a "$LOG_FILE"
else
  echo "ERROR: v44 FVE panel editor verify selhal" | tee -a "$LOG_FILE"
fi

print_result | tee -a "$LOG_FILE"
exit "$FAIL"
