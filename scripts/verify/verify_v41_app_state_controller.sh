#!/usr/bin/env bash
set -u
LOG_DIR="dist/verify"
LOG_FILE="$LOG_DIR/v41_app_state_controller_verify.log"
mkdir -p "$LOG_DIR"
: > "$LOG_FILE"
FAIL=0
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
echo "=== VERIFY v41 APP STATE CONTROLLER ===" | tee -a "$LOG_FILE"
run_and_capture "v40:runtime" bash scripts/verify/verify_v40_runtime.sh
run_and_capture "check:runtime:appStateController" node --check src/runtime/appStateController.js
run_and_capture "check:runtime:index" node --check src/runtime/index.js
run_and_capture "check:runtime:v41test" node --check tests/runtime/v41_app_state_controller_smoke_test.js
run_and_capture "test:runtime:v41" node tests/runtime/v41_app_state_controller_smoke_test.js
echo "" | tee -a "$LOG_FILE"
echo "=== STRICT LOG SCAN v41 ===" | tee -a "$LOG_FILE"
STRICT_PATTERNS="test failed|Test Failed|FAILED|Some smoke tests failed|TypeError|ReferenceError|SyntaxError|ERR_MODULE_NOT_FOUND|Cannot read properties|is not a function|is not defined|ERROR:"
if grep -Ein "$STRICT_PATTERNS" "$LOG_FILE" > "$LOG_DIR/v41_app_state_controller_errors.log"; then
  echo "ERROR: v41 strict scan našel chyby:" | tee -a "$LOG_FILE"
  cat "$LOG_DIR/v41_app_state_controller_errors.log" | tee -a "$LOG_FILE"
  FAIL=1
else
  echo "OK: v41 strict scan bez chybových textů" | tee -a "$LOG_FILE"
fi
echo "" | tee -a "$LOG_FILE"
echo "=== DIFF CHECK ===" | tee -a "$LOG_FILE"
git diff --check 2>&1 | tee -a "$LOG_FILE"
DIFFCHECK=${PIPESTATUS[0]}
if [ "$DIFFCHECK" -ne 0 ]; then FAIL=1; fi
if [ "$FAIL" -eq 0 ]; then
  echo "OK: v41 app state controller verify prošel čistě" | tee -a "$LOG_FILE"
else
  echo "ERROR: v41 app state controller verify selhal" | tee -a "$LOG_FILE"
fi
exit "$FAIL"
