#!/usr/bin/env bash
set -u
LOG_DIR="dist/verify"
LOG_FILE="$LOG_DIR/v42_classic_ui_runtime_adapter_verify.log"
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
echo "=== VERIFY v42 CLASSIC UI RUNTIME ADAPTER ===" | tee -a "$LOG_FILE"
run_and_capture "v41:appState" bash scripts/verify/verify_v41_app_state_controller.sh
run_and_capture "check:runtime:classicUiRuntimeAdapter" node --check src/runtime/classicUiRuntimeAdapter.js
run_and_capture "check:runtime:index" node --check src/runtime/index.js
run_and_capture "check:runtime:v42test" node --check tests/runtime/v42_classic_ui_runtime_adapter_smoke_test.js
run_and_capture "test:runtime:v42" node tests/runtime/v42_classic_ui_runtime_adapter_smoke_test.js
echo "" | tee -a "$LOG_FILE"
echo "=== STRICT LOG SCAN v42 ===" | tee -a "$LOG_FILE"
STRICT_PATTERNS="test failed|Test Failed|FAILED|Some smoke tests failed|TypeError|ReferenceError|SyntaxError|ERR_MODULE_NOT_FOUND|Cannot read properties|is not a function|is not defined|ERROR:"
if grep -Ein "$STRICT_PATTERNS" "$LOG_FILE" > "$LOG_DIR/v42_classic_ui_runtime_adapter_errors.log"; then
  echo "ERROR: v42 strict scan našel chyby:" | tee -a "$LOG_FILE"
  cat "$LOG_DIR/v42_classic_ui_runtime_adapter_errors.log" | tee -a "$LOG_FILE"
  FAIL=1
else
  echo "OK: v42 strict scan bez chybových textů" | tee -a "$LOG_FILE"
fi
echo "" | tee -a "$LOG_FILE"
echo "=== DIFF CHECK ===" | tee -a "$LOG_FILE"
git diff --check 2>&1 | tee -a "$LOG_FILE"
DIFFCHECK=${PIPESTATUS[0]}
if [ "$DIFFCHECK" -ne 0 ]; then FAIL=1; fi
if [ "$FAIL" -eq 0 ]; then
  echo "OK: v42 classic UI runtime adapter verify prošel čistě" | tee -a "$LOG_FILE"
else
  echo "ERROR: v42 classic UI runtime adapter verify selhal" | tee -a "$LOG_FILE"
fi
exit "$FAIL"
