#!/usr/bin/env bash
set -u

echo "=== VERIFY v38 SYSTEM INTEGRATION PREVIEW ==="

HTML="preview/LOSKOT_FVE_LPS_STUDIO_PRO_v38_SYSTEM_INTEGRATION_BRIDGE_PREVIEW.html"
FAIL=0

if [ -f "$HTML" ]; then
  echo "OK: v38 soubor existuje"
else
  echo "ERROR: v38 soubor neexistuje"
  FAIL=1
fi

if [ -f "$HTML" ]; then
  grep -q "LOSKOT" "$HTML" && echo "OK: LOSKOT marker nalezen" || { echo "ERROR: LOSKOT marker chybí"; FAIL=1; }
  grep -q "Classic" "$HTML" && echo "OK: Classic marker nalezen" || echo "WARN: Classic marker nenalezen"
fi

echo ""
echo "=== NODE TESTY ==="

node tests/fve/v31_fve_smoke_test.js
FVE=$?
echo "FVE=$FVE"

node tests/cad/v31_cad_smoke_test.js
CAD=$?
echo "CAD=$CAD"

node tests/lps/v31_lps_smoke_test.js
LPS=$?
echo "LPS=$LPS"

node tests/documents/v31_document_model_smoke_test.js
DOCS=$?
echo "DOCS=$DOCS"

node tests/database/v31_database_repository_smoke_test.js
DB=$?
echo "DB=$DB"

node tests/workflow/v32_workflow_smoke_test.js
WF=$?
echo "WF=$WF"

if [ "$FVE" -ne 0 ] || [ "$CAD" -ne 0 ] || [ "$LPS" -ne 0 ] || [ "$DOCS" -ne 0 ] || [ "$DB" -ne 0 ] || [ "$WF" -ne 0 ]; then
  FAIL=1
fi

if [ "$FAIL" -eq 0 ]; then
  echo "OK: v38 verify prošel"
else
  echo "ERROR: v38 verify selhal"
fi

exit "$FAIL"
