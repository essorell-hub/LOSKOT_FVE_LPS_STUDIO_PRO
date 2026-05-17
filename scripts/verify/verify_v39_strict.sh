#!/usr/bin/env bash
set -u

LOG_DIR="dist/verify"
LOG_FILE="$LOG_DIR/v39_strict_verify.log"

mkdir -p "$LOG_DIR"
: > "$LOG_FILE"

FAIL=0

run_and_capture() {
  local name="$1"
  shift

  echo ""
  echo "=== RUN $name ===" | tee -a "$LOG_FILE"

  "$@" 2>&1 | tee -a "$LOG_FILE"
  local code=${PIPESTATUS[0]}

  echo "=== EXIT $name = $code ===" | tee -a "$LOG_FILE"

  if [ "$code" -ne 0 ]; then
    FAIL=1
  fi
}

echo "=== VERIFY v39 STRICT TEST GATE ===" | tee -a "$LOG_FILE"

HTML="preview/LOSKOT_FVE_LPS_STUDIO_PRO_v38_SYSTEM_INTEGRATION_BRIDGE_PREVIEW.html"

if [ -f "$HTML" ]; then
  echo "OK: v38 preview existuje" | tee -a "$LOG_FILE"
else
  echo "ERROR: v38 preview neexistuje" | tee -a "$LOG_FILE"
  FAIL=1
fi

if [ -f "$HTML" ]; then
  grep -q "LOSKOT" "$HTML" && echo "OK: LOSKOT marker" | tee -a "$LOG_FILE" || { echo "ERROR: chybí LOSKOT marker" | tee -a "$LOG_FILE"; FAIL=1; }
  grep -q "Classic" "$HTML" && echo "OK: Classic marker" | tee -a "$LOG_FILE" || { echo "ERROR: chybí Classic marker" | tee -a "$LOG_FILE"; FAIL=1; }
fi

echo "" | tee -a "$LOG_FILE"
echo "=== NODE SYNTAX CHECK ===" | tee -a "$LOG_FILE"

run_and_capture "check:fve:stringCalculator" node --check src/fve/stringCalculator.js
run_and_capture "check:cad:layerModel" node --check src/cad/layerModel.js
run_and_capture "check:cad:objectModel" node --check src/cad/objectModel.js
run_and_capture "check:lps:lpsObjectModel" node --check src/lps/lpsObjectModel.js
run_and_capture "check:lps:riskAssessmentPlaceholder" node --check src/lps/riskAssessmentPlaceholder.js
run_and_capture "check:workflow:test" node --check tests/workflow/v32_workflow_smoke_test.js

echo "" | tee -a "$LOG_FILE"
echo "=== SMOKE TESTS ===" | tee -a "$LOG_FILE"

run_and_capture "test:fve" node tests/fve/v31_fve_smoke_test.js
run_and_capture "test:cad" node tests/cad/v31_cad_smoke_test.js
run_and_capture "test:lps" node tests/lps/v31_lps_smoke_test.js
run_and_capture "test:documents" node tests/documents/v31_document_model_smoke_test.js
run_and_capture "test:database" node tests/database/v31_database_repository_smoke_test.js
run_and_capture "test:workflow" node tests/workflow/v32_workflow_smoke_test.js

echo "" | tee -a "$LOG_FILE"
echo "=== STRICT LOG SCAN ===" | tee -a "$LOG_FILE"

STRICT_PATTERNS="test failed|Test Failed|FAILED|Some smoke tests failed|TypeError|ReferenceError|SyntaxError|ERR_MODULE_NOT_FOUND|Cannot read properties|is not a function|is not defined|ERROR:"

if grep -Ein "$STRICT_PATTERNS" "$LOG_FILE" > "$LOG_DIR/v39_strict_errors.log"; then
  echo "ERROR: strict scan našel chyby:" | tee -a "$LOG_FILE"
  cat "$LOG_DIR/v39_strict_errors.log" | tee -a "$LOG_FILE"
  FAIL=1
else
  echo "OK: strict scan bez chybových textů" | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"
echo "=== DIFF CHECK ===" | tee -a "$LOG_FILE"
git diff --check 2>&1 | tee -a "$LOG_FILE"
DIFFCHECK=${PIPESTATUS[0]}

if [ "$DIFFCHECK" -ne 0 ]; then
  FAIL=1
fi

echo "" | tee -a "$LOG_FILE"

if [ "$FAIL" -eq 0 ]; then
  echo "OK: v39 strict verify prošel skutečně čistě" | tee -a "$LOG_FILE"
else
  echo "ERROR: v39 strict verify selhal" | tee -a "$LOG_FILE"
fi

exit "$FAIL"
