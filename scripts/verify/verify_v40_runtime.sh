#!/usr/bin/env bash
set -u

LOG_DIR="dist/verify"
LOG_FILE="$LOG_DIR/v40_runtime_verify.log"
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

echo "=== VERIFY v40 RUNTIME BRIDGE ===" | tee -a "$LOG_FILE"

run_and_capture "v39:strict" bash scripts/verify/verify_v39_strict.sh
run_and_capture "check:runtime:appRuntimeBridge" node --check src/runtime/appRuntimeBridge.js
run_and_capture "check:runtime:index" node --check src/runtime/index.js
run_and_capture "check:runtime:test" node --check tests/runtime/v40_runtime_bridge_smoke_test.js
run_and_capture "test:runtime:v40" node tests/runtime/v40_runtime_bridge_smoke_test.js

echo "" | tee -a "$LOG_FILE"
echo "=== STRICT LOG SCAN v40 ===" | tee -a "$LOG_FILE"
STRICT_PATTERNS="test failed|Test Failed|FAILED|Some smoke tests failed|TypeError|ReferenceError|SyntaxError|ERR_MODULE_NOT_FOUND|Cannot read properties|is not a function|is not defined|ERROR:"
if grep -Ein "$STRICT_PATTERNS" "$LOG_FILE" > "$LOG_DIR/v40_runtime_errors.log"; then
  echo "ERROR: v40 strict scan našel chyby:" | tee -a "$LOG_FILE"
  cat "$LOG_DIR/v40_runtime_errors.log" | tee -a "$LOG_FILE"
  FAIL=1
else
  echo "OK: v40 strict scan bez chybových textů" | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"
echo "=== DIFF CHECK ===" | tee -a "$LOG_FILE"
git diff --check 2>&1 | tee -a "$LOG_FILE"
DIFFCHECK=${PIPESTATUS[0]}
if [ "$DIFFCHECK" -ne 0 ]; then FAIL=1; fi

if [ "$FAIL" -eq 0 ]; then
  echo "OK: v40 runtime verify prošel čistě" | tee -a "$LOG_FILE"
else
  echo "ERROR: v40 runtime verify selhal" | tee -a "$LOG_FILE"
fi

exit "$FAIL"
