#!/usr/bin/env bash
set -e

cd /d/Projekty/LOSKOT_FVE_LPS_STUDIO_PRO

echo "=== Kontrola čistého Gitu ==="
git status --short

if [ -n "$(git status --short)" ]; then
  echo "Git není čistý. Nejdřív ukliď změny."
  exit 1
fi

echo "=== ÚKOL 1: shared definitions ==="

cat > prompts/v29_JSON_SCHEMA_SHARED_DEFINITIONS_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON Schema soubor:
database/schema/v29/shared-definitions.schema.json

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
- Piš popisy česky.
- Výstup drž přiměřeně krátký.

Schéma musí obsahovat:
- $schema
- $id
- title
- description
- type: object
- $defs

V $defs vytvoř:
id, timestamp, uuid, status, severity, point2d, point3d, polygon2d, dimensions, address, cadastralInfo, personOrCompany, contact, layerRef, objectRef, entityRef, qaStatus, auditEntry, fileReference, note.

Po dokončení vytvoř commit:
v29 json schema shared definitions
PROMPT

git add prompts/v29_JSON_SCHEMA_SHARED_DEFINITIONS_TASK.txt
git commit -m "Add v29 shared definitions schema prompt" || true

aider --yes-always --config .aider.conf.yml \
  database/schema/v29/shared-definitions.schema.json \
  prompts/v29_JSON_SCHEMA_SHARED_DEFINITIONS_TASK.txt \
  --message-file prompts/v29_JSON_SCHEMA_SHARED_DEFINITIONS_TASK.txt

git push

echo "=== ÚKOL 2: project schema ==="

cat > prompts/v29_JSON_SCHEMA_PROJECT_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON Schema soubor:
database/schema/v29/project.schema.json

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

Schéma project musí obsahovat:
projectId, dataModelVersion, appVersion, createdAt, updatedAt, projectInfo, building, roofs, fve, lps, cad, documents, exports, qa, migrationHistory.

Povinné položky:
projectId, dataModelVersion, appVersion, createdAt, updatedAt, projectInfo.

Po dokončení vytvoř commit:
v29 json schema project
PROMPT

git add prompts/v29_JSON_SCHEMA_PROJECT_TASK.txt
git commit -m "Add v29 project schema prompt" || true

aider --yes-always --config .aider.conf.yml \
  database/schema/v29/project.schema.json \
  database/schema/v29/shared-definitions.schema.json \
  prompts/v29_JSON_SCHEMA_PROJECT_TASK.txt \
  --message-file prompts/v29_JSON_SCHEMA_PROJECT_TASK.txt

git push

echo "=== ÚKOL 3: building schema ==="

cat > prompts/v29_JSON_SCHEMA_BUILDING_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON Schema soubor:
database/schema/v29/building.schema.json

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

Schéma building musí obsahovat:
buildingId, name, description, address, cadastral, owner, investor, designer, geometrySummary, usageType, height, floors, fireSafetyNotes, notes.

Povinné položky:
buildingId, name, address.

Po dokončení vytvoř commit:
v29 json schema building
PROMPT

git add prompts/v29_JSON_SCHEMA_BUILDING_TASK.txt
git commit -m "Add v29 building schema prompt" || true

aider --yes-always --config .aider.conf.yml \
  database/schema/v29/building.schema.json \
  database/schema/v29/shared-definitions.schema.json \
  prompts/v29_JSON_SCHEMA_BUILDING_TASK.txt \
  --message-file prompts/v29_JSON_SCHEMA_BUILDING_TASK.txt

git push

echo "=== HOTOVO ==="
git status
git log --oneline -10
