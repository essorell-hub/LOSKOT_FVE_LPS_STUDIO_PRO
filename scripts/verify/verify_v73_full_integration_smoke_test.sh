#!/usr/bin/env bash
set -u

LOG_DIR="dist/verify"
LOG_FILE="$LOG_DIR/v73_verify.log"
mkdir -p "$LOG_DIR"
: > "$LOG_FILE"

FAIL=0
DIFFCHECK=1

say() { echo "$1" | tee -a "$LOG_FILE"; }
run_check() {
  say "RUN: $*"
  "$@" 2>&1 | tee -a "$LOG_FILE"
  local code=${PIPESTATUS[0]}
  if [ "$code" -ne 0 ]; then FAIL=1; fi
}

say "===== VERIFY V73 FULL INTEGRATION SMOKE TEST START ====="

required_files=(
  "src/runtime/fullIntegrationSmokeTestRuntime.js"
  "tests/runtime/v73_full_integration_smoke_test_smoke_test.js"
  "scripts/verify/verify_v73_full_integration_smoke_test.sh"
  "docs/runtime/v73/v73_FULL_INTEGRATION_SMOKE_TEST.md"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    say "ERROR: missing $file"
    FAIL=1
  else
    say "OK: $file"
  fi
done

run_check node --check src/runtime/fullIntegrationSmokeTestRuntime.js
run_check node --check tests/runtime/v73_full_integration_smoke_test_smoke_test.js
run_check node tests/runtime/v73_full_integration_smoke_test_smoke_test.js

if git diff --name-only | grep -E '(^|/)package(-lock)?\.json$' >/dev/null; then
  say "ERROR: package file changed"
  FAIL=1
else
  say "OK: package guard"
fi

if git diff --name-only | grep -Ei 'preview.*\.html$|\.html$' >/dev/null; then
  say "ERROR: HTML/preview file changed"
  FAIL=1
else
  say "OK: preview/html guard"
fi

git diff --check 2>&1 | tee -a "$LOG_FILE"
DIFFCHECK=${PIPESTATUS[0]}
if [ "$DIFFCHECK" -ne 0 ]; then FAIL=1; fi

if grep -Ein "TypeError|ReferenceError|SyntaxError|FAILED|test failed|is not a function|is not defined|ERR_MODULE_NOT_FOUND|Cannot read properties" "$LOG_FILE" > "$LOG_DIR/v73_strict_errors.log"; then
  say "ERROR: strict log scan found errors"
  cat "$LOG_DIR/v73_strict_errors.log" | tee -a "$LOG_FILE"
  FAIL=1
else
  say "OK: strict log scan"
fi

say "===== LOSKOT RESULT ====="
say "VERIFY=$FAIL"
say "DIFFCHECK=$DIFFCHECK"
say "MERGE=NA"
say "PUSH=NA"
say "LOG=$LOG_FILE"
say "========================="
say "===== VERIFY V73 FULL INTEGRATION SMOKE TEST END ====="
exit "$FAIL"

