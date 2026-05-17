#!/usr/bin/env bash
set +e

cd /d/Projekty/LOSKOT_FVE_LPS_STUDIO_PRO

FILE="preview/LOSKOT_FVE_LPS_STUDIO_PRO_v37_SELF_CHECK_QA_PREVIEW.html"

echo "=== VERIFY v37 PREVIEW ==="

if [ ! -f "$FILE" ]; then
  echo "ERROR: v37 preview neexistuje: $FILE"
  exit 1
fi

echo "OK: soubor existuje"

grep -n "V37_SELF_CHECK_QA_PREVIEW_PATCH" "$FILE" >/dev/null
echo "marker V37: $?"

grep -n "renderV37SelfCheckQa" "$FILE" >/dev/null
echo "funkce renderV37SelfCheckQa: $?"

grep -n "v37SelfCheckQaBtn" "$FILE" >/dev/null
echo "tlačítko v37SelfCheckQaBtn: $?"

grep -n "document.body.innerHTML" "$FILE"
echo "kontrola document.body.innerHTML hotovo"

echo ""
echo "=== EXISTUJÍCÍ TESTY ==="
node tests/fve/v31_fve_smoke_test.js || true
node tests/cad/v31_cad_smoke_test.js || true
node tests/lps/v31_lps_smoke_test.js || true
node tests/documents/v31_document_model_smoke_test.js || true
node tests/database/v31_database_repository_smoke_test.js || true
node tests/workflow/v32_workflow_smoke_test.js || true

echo ""
echo "=== GIT STATUS ==="
git status
