#!/usr/bin/env bash
set -euo pipefail

echo "===== LOSKOT VERIFY V66/V76-V80 PROJECT STORAGE SQLITE IMPORT EXPORT ====="

if [ ! -f "PROJECT_STATE_UNIFIED.md" ]; then
  echo "ERROR: PROJECT_STATE_UNIFIED.md not found. Run from repo root."
  exit 1
fi

if [ ! -f "CHANGELOG.md" ]; then
  echo "ERROR: CHANGELOG.md not found. Run from repo root."
  exit 1
fi

echo "[1/8] package guard"
if git diff --name-only | grep -E '^(package\.json|package-lock\.json)$' >/dev/null 2>&1; then
  echo "ERROR: package.json/package-lock.json changed"
  exit 1
fi

echo "[2/8] preview/html guard"
if git diff --name-only | grep -Ei '(^|/)(preview|index|app).*\.(html)$' >/dev/null 2>&1; then
  echo "ERROR: preview/html changed"
  exit 1
fi

echo "[3/8] node --check runtime"
node --check src/runtime/v66v80/projectStoreV66.js
node --check src/runtime/v66v80/projectMigratorV66.js
node --check src/runtime/v66v80/importExportCoreV66.js
node --check src/runtime/v66v80/sqliteSchemaV80.js
node --check src/runtime/v66v80/index.js

echo "[4/8] node --check smoke"
node --check tests/runtime/v66_v80_project_storage_sqlite_import_export_smoke_test.js

echo "[5/8] smoke test"
node tests/runtime/v66_v80_project_storage_sqlite_import_export_smoke_test.js

echo "[6/8] SQL files exist"
test -f database/sqlite_schema_v76_v80.sql
test -f database/equipment_catalog_seed_v76_v80.sql
test -f database/equipment_catalog_seed_v76_v80.json

echo "[7/8] strict grep"
if grep -RInE "TypeError|ReferenceError|SyntaxError|FAILED|test failed|is not a function|is not defined|ERR_MODULE_NOT_FOUND|Cannot read properties|AssertionError|command failed" \
  src/runtime/v66v80 tests/runtime/v66_v80_project_storage_sqlite_import_export_smoke_test.js 2>/dev/null; then
  echo "ERROR: strict grep found forbidden text"
  exit 1
fi

echo "[8/8] git diff --check"
git diff --check

echo "===== LOSKOT RESULT ====="
echo "VERIFY=0"
echo "DIFFCHECK=0"
echo "SMOKE=0"
echo "STATUS=OK"
echo "========================="
