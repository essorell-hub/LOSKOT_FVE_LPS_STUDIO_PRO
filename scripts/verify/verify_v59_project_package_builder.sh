#!/usr/bin/env bash
set -u
LOG_DIR="dist/verify"
LOG_FILE="$LOG_DIR/v59_verify.log"
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

say "===== VERIFY V59 PROJECT PACKAGE BUILDER START ====="
required_files=(
  "src/runtime/projectPackageBuilder.js"
  "tests/runtime/v59_project_package_builder_smoke_test.js"
  "scripts/verify/verify_v59_project_package_builder.sh"
  "docs/runtime/v59/v59_PROJECT_PACKAGE_BUILDER.md"
  "src/runtime/documentsExportQa.js"
)
for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then say "ERROR: missing $file"; FAIL=1; else say "OK: $file"; fi
done
run_check node --check src/runtime/projectPackageBuilder.js
run_check node --check tests/runtime/v59_project_package_builder_smoke_test.js
run_check node tests/runtime/v59_project_package_builder_smoke_test.js

if git diff --name-only | grep -E '(^|/)package(-lock)?\.json$' >/dev/null; then say "ERROR: package file changed"; FAIL=1; else say "OK: package guard"; fi
if git diff --name-only | grep -Ei 'preview.*\.html$|\.html$' >/dev/null; then say "ERROR: HTML/preview file changed"; FAIL=1; else say "OK: preview/html guard"; fi

git diff --check 2>&1 | tee -a "$LOG_FILE"
DIFFCHECK=${PIPESTATUS[0]}
if [ "$DIFFCHECK" -ne 0 ]; then FAIL=1; fi

if grep -Ein "TypeError|ReferenceError|SyntaxError|FAILED|test failed|is not a function|is not defined|ERR_MODULE_NOT_FOUND|Cannot read properties" "$LOG_FILE" > "$LOG_DIR/v59_strict_errors.log"; then
  say "ERROR: strict log scan found errors"
  cat "$LOG_DIR/v59_strict_errors.log" | tee -a "$LOG_FILE"
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
say "===== VERIFY V59 PROJECT PACKAGE BUILDER END ====="
exit "$FAIL"

