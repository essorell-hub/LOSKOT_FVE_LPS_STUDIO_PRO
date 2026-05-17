#!/usr/bin/env bash
set +e

cd /d/Projekty/LOSKOT_FVE_LPS_STUDIO_PRO

FILE="preview/LOSKOT_FVE_LPS_STUDIO_PRO_v38_SYSTEM_INTEGRATION_BRIDGE_PREVIEW.html"

echo "=== VERIFY v38 SYSTEM INTEGRATION PREVIEW ==="

if [ ! -f "$FILE" ]; then
  echo "ERROR: v38 preview neexistuje: $FILE"
  exit 1
fi

echo "OK: v38 soubor existuje"

grep -n "V38_SYSTEM_INTEGRATION_BRIDGE_PATCH" "$FILE" >/dev/null
echo "marker V38: $?"

grep -n "renderV38SystemIntegration" "$FILE" >/dev/null
echo "funkce renderV38SystemIntegration: $?"

grep -n "v38SystemIntegrationBtn" "$FILE" >/dev/null
echo "tlačítko v38SystemIntegrationBtn: $?"

echo ""
echo "=== NODE TESTY ==="
node tests/fve/v31_fve_smoke_test.js
FVE=$?
echo "FVE test: $FVE"

node tests/cad/v31_cad_smoke_test.js
CAD=$?
echo "CAD test: $CAD"

node tests/lps/v31_lps_smoke_test.js
LPS=$?
echo "LPS test: $LPS"

node tests/documents/v31_document_model_smoke_test.js
DOCS=$?
echo "DOCUMENTS test: $DOCS"

node tests/database/v31_database_repository_smoke_test.js
DB=$?
echo "DATABASE test: $DB"

node tests/workflow/v32_workflow_smoke_test.js
WF=$?
echo "WORKFLOW test: $WF"

echo ""
echo "=== GIT STATUS ==="
git status

if [ "$FVE" -ne 0 ] || [ "$CAD" -ne 0 ] || [ "$LPS" -ne 0 ] || [ "$DOCS" -ne 0 ] || [ "$DB" -ne 0 ] || [ "$WF" -ne 0 ]; then
  echo "ERROR: Některý test selhal."
  exit 1
fi

echo "OK: v38 verify prošel."
