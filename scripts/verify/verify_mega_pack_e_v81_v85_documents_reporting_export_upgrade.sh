#!/usr/bin/env bash
set -euo pipefail

echo "===== LOSKOT VERIFY MEGA PACK E ====="

test -f PROJECT_STATE_UNIFIED.md
test -f CHANGELOG.md

if git diff --name-only | grep -E '^(package\.json|package-lock\.json)$' >/dev/null 2>&1; then
  echo "ERROR: package.json/package-lock.json changed"
  exit 1
fi

if git diff --name-only | grep -Ei '(^|/)(preview|index|app).*\.(html)$' >/dev/null 2>&1; then
  echo "ERROR: preview/html changed"
  exit 1
fi

for f in src/runtime/v81_v85_documents_reporting_export_upgrade/*.js; do
  node --check "$f"
done

node --check tests/runtime/v81_v85_documents_reporting_export_smoke_test.js
node tests/runtime/v81_v85_documents_reporting_export_smoke_test.js

if grep -RInE "TypeError|ReferenceError|SyntaxError|FAILED|test failed|is not a function|is not defined|ERR_MODULE_NOT_FOUND|Cannot read properties|AssertionError|command failed" src/runtime/v81_v85_documents_reporting_export_upgrade tests/runtime/v81_v85_documents_reporting_export_smoke_test.js 2>/dev/null; then
  echo "ERROR: strict grep found forbidden text"
  exit 1
fi

git diff --check

echo "===== LOSKOT RESULT ====="
echo "VERIFY=0"
echo "DIFFCHECK=0"
echo "SMOKE=0"
echo "STATUS=OK"
echo "========================="
