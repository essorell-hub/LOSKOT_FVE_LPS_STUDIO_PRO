#!/usr/bin/env bash
set -e

cd /d/Projekty/LOSKOT_FVE_LPS_STUDIO_PRO

echo "=== Kontrola čistého Gitu ==="
git status --short

if [ -n "$(git status --short)" ]; then
  echo "Git není čistý. Nejdřív ukliď změny."
  exit 1
fi

mkdir -p database/schema/v29 prompts

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

Objekt plane musí obsahovat:
planeId, name, polygon, slope, orientation, usableArea, restrictedArea, assignedPvPanels, assignedAirTerminals, notes.

Po dokončení vytvoř commit:
v29 json schema roof
PROMPT

git add prompts/v29_JSON_SCHEMA_ROOF_TASK.txt
git commit -m "Add v29 roof schema prompt" || true

aider --yes-always --config .aider.conf.yml \
  database/schema/v29/roof.schema.json \
  database/schema/v29/shared-definitions.schema.json \
  prompts/v29_JSON_SCHEMA_ROOF_TASK.txt \
  --message-file prompts/v29_JSON_SCHEMA_ROOF_TASK.txt

git push

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

aider --yes-always --config .aider.conf.yml \
  database/schema/v29/fve.schema.json \
  database/schema/v29/shared-definitions.schema.json \
  prompts/v29_JSON_SCHEMA_FVE_TASK.txt \
  --message-file prompts/v29_JSON_SCHEMA_FVE_TASK.txt

git push

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

Risk assessment musí obsahovat:
riskAssessmentId, method, lpsClassResult, inputParameters, calculatedRisks, acceptedRisks, status, notes.

Air terminal musí obsahovat:
terminalId, roofPlaneId, type, height, position, protectionRadius, connectedTo, cadObjectRef, notes.

Down conductor musí obsahovat:
downConductorId, facadeRef, route, material, crossSection, connectionPoint, earthingRef, cadObjectRef, notes.

LPZ musí obsahovat:
lpzId, name, level, boundaryDescription, relatedObjects, spdRefs, notes.

Po dokončení vytvoř commit:
v29 json schema lps
PROMPT

git add prompts/v29_JSON_SCHEMA_LPS_TASK.txt
git commit -m "Add v29 lps schema prompt" || true

aider --yes-always --config .aider.conf.yml \
  database/schema/v29/lps.schema.json \
  database/schema/v29/shared-definitions.schema.json \
  prompts/v29_JSON_SCHEMA_LPS_TASK.txt \
  --message-file prompts/v29_JSON_SCHEMA_LPS_TASK.txt

git push

echo "=== HOTOVO: schema queue 02 ==="
git status
git log --oneline -12
ls database/schema/v29
