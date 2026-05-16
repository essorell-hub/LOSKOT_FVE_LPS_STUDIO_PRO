#!/usr/bin/env bash
set -e

cd /d/Projekty/LOSKOT_FVE_LPS_STUDIO_PRO

echo "=== LOSKOT v29 schema queue 02 ==="
echo "Kontrola čistého Gitu..."
if [ -n "$(git status --short)" ]; then
  echo "STOP: Git není čistý. Nejdřív ukliď změny."
  git status
  exit 1
fi

mkdir -p database/schema/v29 docs/database/v29 docs/qa/v29 prompts

run_task () {
  local task_name="$1"
  local prompt_file="$2"
  shift 2

  echo ""
  echo "============================================================"
  echo "START: $task_name"
  echo "============================================================"

  aider --yes-always --config .aider.conf.yml "$@" "$prompt_file" --message-file "$prompt_file"

  echo "Kontrola Gitu po úkolu: $task_name"
  git status --short

  if [ -n "$(git status --short)" ]; then
    echo "Aider nechal změny bez commitu, ukládám ručně..."
    git add "$@"
    git commit -m "$task_name" || true
  fi

  git push

  echo "HOTOVO: $task_name"
}

echo "=== ÚKOL 1: roof schema ==="
cat > prompts/v29_JSON_SCHEMA_ROOF_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON Schema soubor:
database/schema/v29/roof.schema.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Použij JSON Schema Draft 2020-12.
- Používej odkazy na shared-definitions.schema.json, pokud to dává smysl.
- Piš popisy česky.
- Výstup drž přiměřeně krátký.

Schéma roof musí obsahovat:
roofId, buildingId, roofType, planes, ridgeLines, eaves, valleys, obstacles, safetyZones, slope, orientation, material, geometryNotes, cadLayerRef, qaStatus, notes.

Plane musí obsahovat:
planeId, name, polygon, slope, orientation, usableArea, restrictedArea, assignedPvPanels, assignedAirTerminals, notes.

Po dokončení vytvoř commit:
v29 json schema roof
PROMPT

git add prompts/v29_JSON_SCHEMA_ROOF_TASK.txt
git commit -m "Add v29 roof schema prompt" || true
run_task "v29 json schema roof" prompts/v29_JSON_SCHEMA_ROOF_TASK.txt database/schema/v29/roof.schema.json database/schema/v29/shared-definitions.schema.json


echo "=== ÚKOL 2: FVE schema ==="
cat > prompts/v29_JSON_SCHEMA_FVE_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON Schema soubor:
database/schema/v29/fve.schema.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Použij JSON Schema Draft 2020-12.
- Používej odkazy na shared-definitions.schema.json, pokud to dává smysl.
- Piš popisy česky.
- Výstup drž přiměřeně krátký.

Schéma FVE musí obsahovat:
panels, strings, inverters, optimizers, dcRoutes, acRoutes, spdDc, spdAc, calculations, datasheets, warnings, qaStatus.

Panel musí obsahovat:
panelId, roofPlaneId, manufacturer, model, powerWp, voc, isc, vmpp, impp, dimensions, position, rotation, stringId, optimizerId, cadObjectRef, notes.

String musí obsahovat:
stringId, inverterId, panelIds, panelCount, vocTotal, vmppTotal, currentA, polarity, dcRouteId, warnings.

Inverter musí obsahovat:
inverterId, manufacturer, model, acPowerKw, mpptCount, stringInputs, location, datasheetRef, notes.

Po dokončení vytvoř commit:
v29 json schema fve
PROMPT

git add prompts/v29_JSON_SCHEMA_FVE_TASK.txt
git commit -m "Add v29 fve schema prompt" || true
run_task "v29 json schema fve" prompts/v29_JSON_SCHEMA_FVE_TASK.txt database/schema/v29/fve.schema.json database/schema/v29/shared-definitions.schema.json


echo "=== ÚKOL 3: LPS schema ==="
cat > prompts/v29_JSON_SCHEMA_LPS_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON Schema soubor:
database/schema/v29/lps.schema.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Použij JSON Schema Draft 2020-12.
- Používej odkazy na shared-definitions.schema.json, pokud to dává smysl.
- Piš popisy česky.
- Výstup drž přiměřeně krátký.

Schéma LPS musí obsahovat:
riskAssessment, lpsClass, airTermination, airTerminals, mesh, downConductors, hvi, earthing, spd, lpz, normativeChecks, warnings, qaStatus.

Air terminal:
terminalId, roofPlaneId, type, height, position, protectionRadius, connectedTo, cadObjectRef, notes.

Down conductor:
downConductorId, facadeRef, route, material, crossSection, connectionPoint, earthingRef, cadObjectRef, notes.

LPZ:
lpzId, name, level, boundaryDescription, relatedObjects, spdRefs, notes.

Po dokončení vytvoř commit:
v29 json schema lps
PROMPT

git add prompts/v29_JSON_SCHEMA_LPS_TASK.txt
git commit -m "Add v29 lps schema prompt" || true
run_task "v29 json schema lps" prompts/v29_JSON_SCHEMA_LPS_TASK.txt database/schema/v29/lps.schema.json database/schema/v29/shared-definitions.schema.json


echo "=== ÚKOL 4: CAD schema ==="
cat > prompts/v29_JSON_SCHEMA_CAD_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON Schema soubor:
database/schema/v29/cad.schema.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Použij JSON Schema Draft 2020-12.
- Používej odkazy na shared-definitions.schema.json, pokud to dává smysl.
- Piš popisy česky.
- Výstup drž přiměřeně krátký.

Schéma CAD musí obsahovat:
layers, objects, view, scale, grid, snap, selectedObjects, lastEdit, warnings, qaStatus.

Layer musí obsahovat:
layerId, name, type, visible, locked, opacity, order, colorHint, notes.

Object musí obsahovat:
objectId, layerId, entityType, entityRef, geometryType, points, position, rotation, dimensions, style, locked, notes.

Po dokončení vytvoř commit:
v29 json schema cad
PROMPT

git add prompts/v29_JSON_SCHEMA_CAD_TASK.txt
git commit -m "Add v29 cad schema prompt" || true
run_task "v29 json schema cad" prompts/v29_JSON_SCHEMA_CAD_TASK.txt database/schema/v29/cad.schema.json database/schema/v29/shared-definitions.schema.json


echo "=== ÚKOL 5: documents schema ==="
cat > prompts/v29_JSON_SCHEMA_DOCUMENTS_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON Schema soubor:
database/schema/v29/documents.schema.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Použij JSON Schema Draft 2020-12.
- Používej odkazy na shared-definitions.schema.json, pokud to dává smysl.
- Piš popisy česky.
- Výstup drž přiměřeně krátký.

Schéma documents musí obsahovat:
documentTemplates, generatedDocuments, datasheets, attachments, approvals, warnings, qaStatus.

Generated document:
documentId, templateId, title, type, status, createdAt, updatedAt, fileRef, relatedEntities, notes.

Datasheet:
datasheetId, deviceType, manufacturer, model, fileRef, source, verified, relatedEntities, notes.

Po dokončení vytvoř commit:
v29 json schema documents
PROMPT

git add prompts/v29_JSON_SCHEMA_DOCUMENTS_TASK.txt
git commit -m "Add v29 documents schema prompt" || true
run_task "v29 json schema documents" prompts/v29_JSON_SCHEMA_DOCUMENTS_TASK.txt database/schema/v29/documents.schema.json database/schema/v29/shared-definitions.schema.json


echo "=== ÚKOL 6: exports schema ==="
cat > prompts/v29_JSON_SCHEMA_EXPORTS_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON Schema soubor:
database/schema/v29/exports.schema.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Použij JSON Schema Draft 2020-12.
- Používej odkazy na shared-definitions.schema.json, pokud to dává smysl.
- Piš popisy česky.
- Výstup drž přiměřeně krátký.

Schéma exports musí obsahovat:
exportProfiles, exportHistory, packages, printSettings, warnings, qaStatus.

Export profile:
profileId, name, type, includedSections, fileNamingRule, outputFormat, enabled, notes.

Export package:
packageId, profileId, createdAt, status, files, manifest, checksum, notes.

Po dokončení vytvoř commit:
v29 json schema exports
PROMPT

git add prompts/v29_JSON_SCHEMA_EXPORTS_TASK.txt
git commit -m "Add v29 exports schema prompt" || true
run_task "v29 json schema exports" prompts/v29_JSON_SCHEMA_EXPORTS_TASK.txt database/schema/v29/exports.schema.json database/schema/v29/shared-definitions.schema.json


echo "=== ÚKOL 7: QA schema ==="
cat > prompts/v29_JSON_SCHEMA_QA_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON Schema soubor:
database/schema/v29/qa.schema.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Použij JSON Schema Draft 2020-12.
- Používej odkazy na shared-definitions.schema.json, pokud to dává smysl.
- Piš popisy česky.
- Výstup drž přiměřeně krátký.

Schéma QA musí obsahovat:
checks, score, status, errors, warnings, lastRunAt, summary, relatedEntities.

Check:
checkId, category, title, severity, status, message, relatedEntityRef, expectedValue, actualValue, recommendation, createdAt.

Po dokončení vytvoř commit:
v29 json schema qa
PROMPT

git add prompts/v29_JSON_SCHEMA_QA_TASK.txt
git commit -m "Add v29 qa schema prompt" || true
run_task "v29 json schema qa" prompts/v29_JSON_SCHEMA_QA_TASK.txt database/schema/v29/qa.schema.json database/schema/v29/shared-definitions.schema.json


echo ""
echo "=== HOTOVO: v29 schema queue 02 ==="
git status
git log --oneline -20
echo ""
echo "Schémata:"
ls database/schema/v29
