#!/usr/bin/env bash
set -e

cd /d/Projekty/LOSKOT_FVE_LPS_STUDIO_PRO

echo "=== LOSKOT v29 Validation + QA queue ==="

if [ -n "$(git status --short)" ]; then
  echo "STOP: Git není čistý."
  git status
  exit 1
fi

mkdir -p docs/validation/v29 docs/qa/v29 docs/roadmap prompts database/validation/v29

run_task () {
  local task_name="$1"
  local prompt_file="$2"
  shift 2

  echo ""
  echo "============================================================"
  echo "START: $task_name"
  echo "============================================================"

  aider --yes-always --config .aider.conf.yml "$@" "$prompt_file" --message-file "$prompt_file"

  if [ -n "$(git status --short)" ]; then
    echo "Aider nechal změny bez commitu, ukládám ručně..."
    git add "$@" "$prompt_file"
    git commit -m "$task_name" || true
  fi

  git push
  echo "HOTOVO: $task_name"
}

cat > prompts/v29_VALIDATION_RULES_CONTRACT_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON soubor:
database/validation/v29/validation-rules-contract.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.

Kontrakt musí obsahovat:
- contractVersion
- dataModelVersion
- validationLevels
- ruleCategories
- requiredChecks
- warningChecks
- errorChecks
- entityReferenceChecks
- importChecks
- exportChecks
- sqliteChecks
- fallbackBehavior
- notes

Kategorie pravidel:
schema, references, fve, lps, cad, documents, exports, qa, migration, sqlite.

Po dokončení vytvoř commit:
v29 validation rules contract
PROMPT

git add prompts/v29_VALIDATION_RULES_CONTRACT_TASK.txt
git commit -m "Add v29 validation rules contract prompt" || true

run_task "v29 validation rules contract" prompts/v29_VALIDATION_RULES_CONTRACT_TASK.txt \
  database/validation/v29/validation-rules-contract.json


cat > prompts/v29_JSON_VALIDATION_GUIDE_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/validation/v29/v29_JSON_VALIDATION_GUIDE.md

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
1. Účel validace JSON projektu.
2. Validace proti JSON schématům.
3. Validace povinných sekcí.
4. Validace povinných polí.
5. Validace datových typů.
6. Validace referencí mezi entitami.
7. Validace FVE části.
8. Validace LPS/DEHN části.
9. Validace CAD/mapa části.
10. Validace documents.
11. Validace exports.
12. Validace qa.
13. Validace migrationHistory.
14. Chování při warning.
15. Chování při error.
16. Chování při critical.
17. Doporučený postup před importem.
18. Doporučený postup před exportem.
19. Rizika.
20. Checklist.

Po dokončení vytvoř commit:
v29 json validation guide
PROMPT

git add prompts/v29_JSON_VALIDATION_GUIDE_TASK.txt
git commit -m "Add v29 json validation guide prompt" || true

run_task "v29 json validation guide" prompts/v29_JSON_VALIDATION_GUIDE_TASK.txt \
  docs/validation/v29/v29_JSON_VALIDATION_GUIDE.md


cat > prompts/v29_ENTITY_REFERENCE_VALIDATION_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/validation/v29/v29_ENTITY_REFERENCE_VALIDATION.md

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
1. Účel kontroly referencí.
2. projectId reference.
3. buildingId reference.
4. roofId reference.
5. roofPlaneId reference.
6. panelId reference.
7. stringId reference.
8. inverterId reference.
9. dcRouteId reference.
10. airTerminalId reference.
11. downConductorId reference.
12. hviId reference.
13. lpzId reference.
14. spdId reference.
15. cad layerRef.
16. cad objectRef.
17. document fileRef.
18. QA relatedEntityRef.
19. Co dělat při chybějící referenci.
20. Co dělat při osiřelé entitě.
21. Co dělat při cyklické referenci.
22. Checklist.

Po dokončení vytvoř commit:
v29 entity reference validation
PROMPT

git add prompts/v29_ENTITY_REFERENCE_VALIDATION_TASK.txt
git commit -m "Add v29 entity reference validation prompt" || true

run_task "v29 entity reference validation" prompts/v29_ENTITY_REFERENCE_VALIDATION_TASK.txt \
  docs/validation/v29/v29_ENTITY_REFERENCE_VALIDATION.md


cat > prompts/v29_QA_TRAFFIC_LIGHT_RULES_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/qa/v29/v29_QA_TRAFFIC_LIGHT_RULES.md

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
1. Účel QA semaforu.
2. Stav OK.
3. Stav WARNING.
4. Stav ERROR.
5. Stav CRITICAL.
6. Stav PENDING.
7. Výpočet celkového stavu projektu.
8. Priorita chyb.
9. FVE QA pravidla.
10. LPS QA pravidla.
11. CAD QA pravidla.
12. Dokumenty QA pravidla.
13. Export QA pravidla.
14. SQLite QA pravidla.
15. Import QA pravidla.
16. Jak zobrazovat chyby uživateli.
17. Jak zabránit bílé obrazovce.
18. Jak logovat QA výsledek.
19. Checklist.

Po dokončení vytvoř commit:
v29 qa traffic light rules
PROMPT

git add prompts/v29_QA_TRAFFIC_LIGHT_RULES_TASK.txt
git commit -m "Add v29 qa traffic light rules prompt" || true

run_task "v29 qa traffic light rules" prompts/v29_QA_TRAFFIC_LIGHT_RULES_TASK.txt \
  docs/qa/v29/v29_QA_TRAFFIC_LIGHT_RULES.md


cat > prompts/v29_SAMPLE_IMPORT_VALIDATION_PLAN_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/qa/v29/v29_SAMPLE_IMPORT_VALIDATION_PLAN.md

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
1. Účel testování importu sample projektů.
2. Test v29_minimal_project.json.
3. Test v29_full_fve_lps_project.json.
4. Test v29_roof_geometry_project.json.
5. Test v29_qa_warning_project.json.
6. Kontrola JSON syntaxe.
7. Kontrola JSON schémat.
8. Kontrola referencí.
9. Kontrola migrationHistory.
10. Kontrola QA výsledků.
11. Kontrola SQLite mapování.
12. Očekávané warningy.
13. Očekávané error stavy.
14. Postup ručního testu.
15. Tabulka test / očekávání / výsledek / stav.

Po dokončení vytvoř commit:
v29 sample import validation plan
PROMPT

git add prompts/v29_SAMPLE_IMPORT_VALIDATION_PLAN_TASK.txt
git commit -m "Add v29 sample import validation plan prompt" || true

run_task "v29 sample import validation plan" prompts/v29_SAMPLE_IMPORT_VALIDATION_PLAN_TASK.txt \
  docs/qa/v29/v29_SAMPLE_IMPORT_VALIDATION_PLAN.md


cat > prompts/v29_COMPLETION_CHECKLIST_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/roadmap/v29_COMPLETION_CHECKLIST.md

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- Piš česky, technicky a prakticky.
- Výstup max 200 řádků.

Dokument musí obsahovat:
1. Přehled, co je ve v29 hotové.
2. Datový model.
3. JSON schémata.
4. Sample projekty.
5. SQLite návrh.
6. Import/export kontrakty.
7. Validace.
8. QA pravidla.
9. Co ještě chybí do v29.
10. Co se má přesunout do v30.
11. Připravenost na data layer implementation.
12. Připravenost na UI napojení.
13. Připravenost na Windows/Tauri.
14. Rizika.
15. Checklist před uzavřením v29.
16. Doporučené další kroky.

Po dokončení vytvoř commit:
v29 completion checklist
PROMPT

git add prompts/v29_COMPLETION_CHECKLIST_TASK.txt
git commit -m "Add v29 completion checklist prompt" || true

run_task "v29 completion checklist" prompts/v29_COMPLETION_CHECKLIST_TASK.txt \
  docs/roadmap/v29_COMPLETION_CHECKLIST.md


cat > prompts/v30_DATA_LAYER_IMPLEMENTATION_PREVIEW_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Toto je prompt pro budoucí bezpečný v30 běh.

Cíl:
Připravit první implementační náhled datové vrstvy bez zásahu do vzhledu programu.

Přísná pravidla pro v30:
- Neměnit Classic PRO vzhled.
- Neměnit HTML preview.
- Neměnit CSS.
- Neměnit menu.
- Neměnit přepínání obrazovek.
- Nesmí vzniknout bílá obrazovka.
- Nezasahovat do FVE/LPS/CAD UI.
- Nejprve vytvořit pouze samostatné datové moduly.
- Každý krok malý, testovatelný, revertovatelný.

Povolené cílové oblasti pro v30:
- src/data/
- src/validation/
- src/importExport/
- docs/data-layer/
- tests/data/
- package.json pouze pokud je nutné doplnit skripty.

První v30 úkol:
- vytvořit projectModel adapter,
- načíst v29 sample project,
- validovat proti základnímu kontraktu,
- vrátit QA status,
- bez napojení do UI.

Po změně vytvořit malý commit:
v30 data layer implementation preview prompt
PROMPT

git add prompts/v30_DATA_LAYER_IMPLEMENTATION_PREVIEW_TASK.txt
git commit -m "Add v30 data layer implementation preview prompt" || true

git push

echo ""
echo "=== HOTOVO: v29 Validation + QA queue ==="
git status
git log --oneline -30

echo ""
echo "Validation soubory:"
ls docs/validation/v29 || true

echo ""
echo "QA soubory:"
ls docs/qa/v29 || true

echo ""
echo "Roadmap:"
ls docs/roadmap || true
