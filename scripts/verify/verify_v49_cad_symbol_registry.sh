#!/usr/bin/env bash
set -u
FAIL=0
LOG_DIR="dist/verify"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/verify_v49_cad_symbol_registry.log"
exec > >(tee "$LOG_FILE") 2>&1

echo "===== VERIFY v49 CAD SYMBOL REGISTRY START ====="
node --check src/runtime/cadSymbolRegistry.js || FAIL=1
node --check tests/runtime/v49_cad_symbol_registry_smoke_test.js || FAIL=1
node tests/runtime/v49_cad_symbol_registry_smoke_test.js || FAIL=1
if grep -R "document\.querySelector\|window\.\|localStorage\|innerHTML" src/runtime/cadSymbolRegistry.js tests/runtime/v49_cad_symbol_registry_smoke_test.js; then
  echo "ERROR: v49 registry musi zustat DOM-free."
  FAIL=1
fi
if git diff -- package.json package-lock.json scripts/verify/verify.sh scripts/verify/index.sh >/tmp/v49_package_guard.diff 2>/dev/null; then
  if [ -s /tmp/v49_package_guard.diff ]; then
    echo "ERROR: package nebo hlavni verify soubory byly zmeneny."
    cat /tmp/v49_package_guard.diff
    FAIL=1
  fi
fi
echo "===== VERIFY v49 CAD SYMBOL REGISTRY END code=$FAIL ====="
exit $FAIL
