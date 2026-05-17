#!/usr/bin/env bash
set -u
LOG_DIR="dist/verify"
LOG_FILE="$LOG_DIR/v45_fve_cad_panel_interaction_verify.log"
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
echo "=== VERIFY v45 FVE CAD PANEL INTERACTION ===" | tee -a "$LOG_FILE"
run_and_capture "v44:fvePanelEditor" bash scripts/verify/verify_v44_fve_panel_editor.sh
run_and_capture "check:runtime:fveCadPanelInteraction" node --check src/runtime/fveCadPanelInteraction.js
run_and_capture "check:runtime:index" node --check src/runtime/index.js
run_and_capture "check:runtime:v45test" node --check tests/runtime/v45_fve_cad_panel_interaction_smoke_test.js
run_and_capture "test:runtime:v45" node tests/runtime/v45_fve_cad_panel_interaction_smoke_test.js

echo "" | tee -a "$LOG_FILE"
echo "=== PACKAGE GUARD ===" | tee -a "$LOG_FILE"
if git diff --name-only | grep -E "^package(-lock)?\.json$" > "$LOG_DIR/v45_package_guard.log"; then
  echo "ERROR: v45 nesmí měnit package.json ani package-lock.json" | tee -a "$LOG_FILE"
  cat "$LOG_DIR/v45_package_guard.log" | tee -a "$LOG_FILE"
  FAIL=1
else
  echo "OK: package guard čistý" | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"
echo "=== STRICT LOG SCAN v45 ===" | tee -a "$LOG_FILE"
STRICT_PATTERNS="test failed|Test Failed|FAILED|Some smoke tests failed|TypeError|ReferenceError|SyntaxError|ERR_MODULE_NOT_FOUND|Cannot read properties|is not a function|is not defined|ERROR:"
if grep -Ein "$STRICT_PATTERNS" "$LOG_FILE" > "$LOG_DIR/v45_fve_cad_panel_interaction_errors.log"; then
  echo "ERROR: v45 strict scan našel chyby:" | tee -a "$LOG_FILE"
  cat "$LOG_DIR/v45_fve_cad_panel_interaction_errors.log" | tee -a "$LOG_FILE"
  FAIL=1
else
  echo "OK: v45 strict scan bez chybových textů" | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"
echo "=== DIFF CHECK ===" | tee -a "$LOG_FILE"
git diff --check 2>&1 | tee -a "$LOG_FILE"
DIFFCHECK=${PIPESTATUS[0]}
if [ "$DIFFCHECK" -ne 0 ]; then FAIL=1; fi

if [ "$FAIL" -eq 0 ]; then
  echo "OK: v45 FVE CAD panel interaction verify prošel čistě" | tee -a "$LOG_FILE"
else
  echo "ERROR: v45 FVE CAD panel interaction verify selhal" | tee -a "$LOG_FILE"
fi

print_result | tee -a "$LOG_FILE"
exit "$FAIL"
