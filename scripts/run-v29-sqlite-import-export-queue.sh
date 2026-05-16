#!/usr/bin/env bash
set -e

cd /d/Projekty/LOSKOT_FVE_LPS_STUDIO_PRO

echo "=== LOSKOT v29 SQLite + Import/Export queue ==="
echo "Kontrola čistého Gitu..."
if [ -n "$(git status --short)" ]; then
  echo "STOP: Git není čistý. Nejdřív ukliď změny."
  git status
  exit 1
fi

mkdir -p database/sqlite/v29 database/contracts/v29 docs/database/v29 docs/export/v29 docs/qa/v29 prompts

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

echo "=== ÚKOL 1: SQLite init schema ==="
cat > prompts/v29_SQLITE_INIT_SCHEMA_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden SQL soubor:
database/sqlite/v29/001_init_v29_schema.sql

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- Nevytvářej binární databázi.
- Pouze SQL textový soubor.
- Používej SQLite syntaxi.
- Nepoužívej DROP TABLE.
- Používej CREATE TABLE IF NOT EXISTS.
- Každá tabulka má mít created_at a updated_at, kde to dává smysl.

Vytvoř tabulky:
- projects
- buildings
- cadastral_info
- roofs
- roof_planes
- roof_obstacles
- fve_panels
- fve_strings
- inverters
- optimizers
- dc_routes
- ac_routes
- lps_risk_assessments
- lps_air_terminals
- lps_downconductors
- lps_hvi
- earthing
- spd_devices
- lpz_zones
- cad_layers
- cad_objects
- documents
- datasheets
- exports
- qa_checks
- audit_log
- app_settings
- reference_values

Použij TEXT primární klíče.
Použij project_id pro vazbu na projects.
Použij foreign keys tam, kde to dává smysl.
Na začátek dej PRAGMA foreign_keys = ON;

Po dokončení vytvoř commit:
v29 sqlite init schema
PROMPT

git add prompts/v29_SQLITE_INIT_SCHEMA_TASK.txt
git commit -m "Add v29 sqlite init schema prompt" || true

run_task "v29 sqlite init schema" prompts/v29_SQLITE_INIT_SCHEMA_TASK.txt \
  database/sqlite/v29/001_init_v29_schema.sql


echo "=== ÚKOL 2: SQLite indexes ==="
cat > prompts/v29_SQLITE_INDEXES_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden SQL soubor:
database/sqlite/v29/002_indexes_v29.sql

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- Pouze SQL textový soubor.
- Používej SQLite syntaxi.
- Nepoužívej DROP INDEX.
- Používej CREATE INDEX IF NOT EXISTS.

Vytvoř indexy pro:
- project_id ve všech projektových tabulkách,
- building_id,
- roof_id,
- roof_plane_id,
- string_id,
- inverter_id,
- lps_class,
- lpz_id,
- layer_id,
- entity_ref,
- qa status,
- export status,
- created_at,
- updated_at.

Přidej komentáře, proč index existuje.

Po dokončení vytvoř commit:
v29 sqlite indexes
PROMPT

git add prompts/v29_SQLITE_INDEXES_TASK.txt
git commit -m "Add v29 sqlite indexes prompt" || true

run_task "v29 sqlite indexes" prompts/v29_SQLITE_INDEXES_TASK.txt \
  database/sqlite/v29/002_indexes_v29.sql


echo "=== ÚKOL 3: SQLite seed reference data ==="
cat > prompts/v29_SQLITE_SEED_REFERENCE_DATA_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden SQL soubor:
database/sqlite/v29/003_seed_v29_reference_data.sql

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- Pouze SQL textový soubor.
- Používej SQLite syntaxi.
- Seed musí být opakovatelný.
- Použij INSERT OR IGNORE.

Vlož referenční hodnoty do reference_values:
- LPS třídy I, II, III, IV
- QA severity: info, warning, error, critical
- QA status: pending, ok, warning, error, skipped
- CAD layer typy: roof, fve, lps, dc_route, ac_route, notes, map
- typy dokumentů: report, protocol, datasheet, drawing, export_package
- typy exportů: json, pdf, docx, zip, cad_preview
- SPD typy: DC T1+T2, DC T2, AC T1+T2, AC T2
- FVE komponenty: panel, string, inverter, optimizer, dc_route, ac_route
- LPS komponenty: air_terminal, mesh, downconductor, hvi, earthing, lpz

Po dokončení vytvoř commit:
v29 sqlite seed reference data
PROMPT

git add prompts/v29_SQLITE_SEED_REFERENCE_DATA_TASK.txt
git commit -m "Add v29 sqlite seed prompt" || true

run_task "v29 sqlite seed reference data" prompts/v29_SQLITE_SEED_REFERENCE_DATA_TASK.txt \
  database/sqlite/v29/003_seed_v29_reference_data.sql


echo "=== ÚKOL 4: SQLite schema notes ==="
cat > prompts/v29_SQLITE_SCHEMA_NOTES_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
database/sqlite/v29/v29_sqlite_schema_notes.md

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- Piš česky, technicky a prakticky.
- Výstup max 160 řádků.

Dokument musí obsahovat:
1. Účel SQLite schématu.
2. Popis 001_init_v29_schema.sql.
3. Popis 002_indexes_v29.sql.
4. Popis 003_seed_v29_reference_data.sql.
5. Jak SQL soubory spouštět.
6. Proč nepoužívat destruktivní DROP.
7. Jak řešit migrace.
8. Jak řešit JSON fallback.
9. Jak řešit chybu při inicializaci databáze.
10. Doporučení pro Tauri/Windows.
11. Kontrolní checklist.

Po dokončení vytvoř commit:
v29 sqlite schema notes
PROMPT

git add prompts/v29_SQLITE_SCHEMA_NOTES_TASK.txt
git commit -m "Add v29 sqlite schema notes prompt" || true

run_task "v29 sqlite schema notes" prompts/v29_SQLITE_SCHEMA_NOTES_TASK.txt \
  database/sqlite/v29/v29_sqlite_schema_notes.md


echo "=== ÚKOL 5: JSON to SQLite mapping ==="
cat > prompts/v29_JSON_TO_SQLITE_MAPPING_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/database/v29/v29_JSON_TO_SQLITE_MAPPING.md

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- Piš česky, technicky a prakticky.
- Výstup max 180 řádků.

Dokument musí obsahovat:
1. Účel mapování.
2. Zásadu: JSON fallback zůstává zdroj přenositelnosti.
3. Zásadu: SQLite je pracovní úložiště Windows aplikace.
4. Tabulku JSON path / SQLite table / hlavní klíč / poznámka.
5. Mapování projectInfo.
6. Mapování building.
7. Mapování roofs.
8. Mapování roofPlanes.
9. Mapování FVE panels.
10. Mapování FVE strings.
11. Mapování inverters.
12. Mapování LPS.
13. Mapování CAD layers/objects.
14. Mapování documents/datasheets.
15. Mapování exports.
16. Mapování QA checks.
17. Mapování audit log.
18. Importní postup.
19. Exportní postup.
20. Rizika a doporučení.

Po dokončení vytvoř commit:
v29 json to sqlite mapping
PROMPT

git add prompts/v29_JSON_TO_SQLITE_MAPPING_TASK.txt
git commit -m "Add v29 json to sqlite mapping prompt" || true

run_task "v29 json to sqlite mapping" prompts/v29_JSON_TO_SQLITE_MAPPING_TASK.txt \
  docs/database/v29/v29_JSON_TO_SQLITE_MAPPING.md


echo "=== ÚKOL 6: Project import contract ==="
cat > prompts/v29_PROJECT_IMPORT_CONTRACT_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON soubor:
database/contracts/v29/project-import-contract.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Popisy mohou být česky.
- Výstup drž přiměřeně krátký.

Kontrakt musí obsahovat:
- contractVersion
- name
- acceptedDataModelVersions
- requiredSections
- optionalSections
- validationSteps
- migrationSteps
- errorHandling
- fallbackBehavior
- rejectedConditions
- warnings
- notes

Zahrň pravidla:
- neplatný JSON se neimportuje,
- starší dataModelVersion se pokusí migrovat,
- neznámá pole se nezahazují bez varování,
- při chybě se nesmí poškodit aktuální projekt,
- import má mít preview/confirm krok.

Po dokončení vytvoř commit:
v29 project import contract
PROMPT

git add prompts/v29_PROJECT_IMPORT_CONTRACT_TASK.txt
git commit -m "Add v29 project import contract prompt" || true

run_task "v29 project import contract" prompts/v29_PROJECT_IMPORT_CONTRACT_TASK.txt \
  database/contracts/v29/project-import-contract.json


echo "=== ÚKOL 7: Project export contract ==="
cat > prompts/v29_PROJECT_EXPORT_CONTRACT_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON soubor:
database/contracts/v29/project-export-contract.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Popisy mohou být česky.
- Výstup drž přiměřeně krátký.

Kontrakt musí obsahovat:
- contractVersion
- name
- exportFormat
- includedSections
- optionalSections
- excludedSections
- metadata
- integrityChecks
- fileNamingRules
- packageRules
- errorHandling
- notes

Zahrň pravidla:
- export nesmí měnit projekt,
- export musí obsahovat dataModelVersion,
- export musí umět plný projekt i částečný balík,
- export musí vytvořit manifest,
- export musí označit warningy.

Po dokončení vytvoř commit:
v29 project export contract
PROMPT

git add prompts/v29_PROJECT_EXPORT_CONTRACT_TASK.txt
git commit -m "Add v29 project export contract prompt" || true

run_task "v29 project export contract" prompts/v29_PROJECT_EXPORT_CONTRACT_TASK.txt \
  database/contracts/v29/project-export-contract.json


echo "=== ÚKOL 8: QA result contract ==="
cat > prompts/v29_QA_RESULT_CONTRACT_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON soubor:
database/contracts/v29/qa-result-contract.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Popisy mohou být česky.
- Výstup drž přiměřeně krátký.

Kontrakt musí obsahovat:
- contractVersion
- qaRunId
- projectId
- dataModelVersion
- appVersion
- status
- score
- errors
- warnings
- checks
- summary
- createdAt
- finishedAt
- notes

Check musí obsahovat:
- checkId
- category
- severity
- status
- message
- relatedEntityRef
- recommendation

Po dokončení vytvoř commit:
v29 qa result contract
PROMPT

git add prompts/v29_QA_RESULT_CONTRACT_TASK.txt
git commit -m "Add v29 qa result contract prompt" || true

run_task "v29 qa result contract" prompts/v29_QA_RESULT_CONTRACT_TASK.txt \
  database/contracts/v29/qa-result-contract.json


echo "=== ÚKOL 9: Export package contract ==="
cat > prompts/v29_EXPORT_PACKAGE_CONTRACT_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON soubor:
database/contracts/v29/export-package-contract.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Popisy mohou být česky.
- Výstup drž přiměřeně krátký.

Kontrakt musí obsahovat:
- contractVersion
- packageId
- projectId
- packageType
- createdAt
- createdByAppVersion
- files
- manifest
- checksums
- qaSummary
- warnings
- notes

Files položka:
- fileId
- relativePath
- fileType
- required
- checksum
- relatedEntityRefs

Po dokončení vytvoř commit:
v29 export package contract
PROMPT

git add prompts/v29_EXPORT_PACKAGE_CONTRACT_TASK.txt
git commit -m "Add v29 export package contract prompt" || true

run_task "v29 export package contract" prompts/v29_EXPORT_PACKAGE_CONTRACT_TASK.txt \
  database/contracts/v29/export-package-contract.json


echo "=== ÚKOL 10: Import/export guide ==="
cat > prompts/v29_IMPORT_EXPORT_GUIDE_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/export/v29/v29_IMPORT_EXPORT_GUIDE.md

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- Piš česky, technicky a prakticky.
- Výstup max 180 řádků.

Dokument musí obsahovat:
1. Účel import/export vrstvy.
2. Import JSON projektu.
3. Export JSON projektu.
4. Export dokumentačního balíčku.
5. Export QA výsledků.
6. Export CAD náhledu.
7. Vazba na SQLite.
8. Vazba na JSON schémata.
9. Chování při chybě.
10. Preview/confirm krok při importu.
11. Rollback pravidla.
12. Manifest exportního balíčku.
13. Doporučený postup pro neprogramátora.
14. QA checklist před exportem.
15. Rizika.

Po dokončení vytvoř commit:
v29 import export guide
PROMPT

git add prompts/v29_IMPORT_EXPORT_GUIDE_TASK.txt
git commit -m "Add v29 import export guide prompt" || true

run_task "v29 import export guide" prompts/v29_IMPORT_EXPORT_GUIDE_TASK.txt \
  docs/export/v29/v29_IMPORT_EXPORT_GUIDE.md


echo "=== ÚKOL 11: Import/export QA checklist ==="
cat > prompts/v29_IMPORT_EXPORT_QA_CHECKLIST_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/qa/v29/v29_IMPORT_EXPORT_QA_CHECKLIST.md

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- Piš česky, technicky a prakticky.
- Výstup max 160 řádků.

Dokument musí obsahovat:
1. Kontrola importu validního JSON.
2. Kontrola importu nevalidního JSON.
3. Kontrola importu starší verze.
4. Kontrola migrationHistory.
5. Kontrola exportu plného projektu.
6. Kontrola exportu části projektu.
7. Kontrola manifestu.
8. Kontrola checksum polí.
9. Kontrola QA výsledků.
10. Kontrola warningů.
11. Kontrola rollbacku.
12. Kontrola, že export nemění projekt.
13. Tabulka test / očekávaný výsledek / skutečný výsledek / stav.

Po dokončení vytvoř commit:
v29 import export qa checklist
PROMPT

git add prompts/v29_IMPORT_EXPORT_QA_CHECKLIST_TASK.txt
git commit -m "Add v29 import export qa checklist prompt" || true

run_task "v29 import export qa checklist" prompts/v29_IMPORT_EXPORT_QA_CHECKLIST_TASK.txt \
  docs/qa/v29/v29_IMPORT_EXPORT_QA_CHECKLIST.md


echo ""
echo "=== HOTOVO: v29 SQLite + Import/Export queue ==="
git status
git log --oneline -30

echo ""
echo "SQLite soubory:"
ls database/sqlite/v29

echo ""
echo "Kontrakty:"
ls database/contracts/v29
