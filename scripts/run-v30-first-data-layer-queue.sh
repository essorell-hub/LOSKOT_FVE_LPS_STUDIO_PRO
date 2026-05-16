#!/usr/bin/env bash
set -e

cd /d/Projekty/LOSKOT_FVE_LPS_STUDIO_PRO

echo "=== LOSKOT v30 first data layer implementation queue ==="

if [ -n "$(git status --short)" ]; then
  echo "STOP: Git není čistý."
  git status
  exit 1
fi

mkdir -p src/data src/validation src/importExport tests/data docs/data-layer/v30 prompts

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

cat > prompts/v30_PROJECT_MODEL_ADAPTER_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden soubor:
src/data/projectModel.js

Přísná pravidla:
- Neměň HTML.
- Neměň CSS.
- Neměň preview.
- Neměň UI.
- Neměň Classic PRO vzhled.
- Neměň přepínání obrazovek.
- Neměň PROJECT_STATE_UNIFIED.md.
- Neměň CHANGELOG.md.
- Nemaž žádné soubory.
- Nepřidávej závislosti do package.json.
- Kód musí být samostatný a bezpečný.
- Pokud vstup chybí nebo je poškozený, vrať bezpečný fallback, ne výjimku pro UI.

Soubor má exportovat:
- DATA_MODEL_VERSION = "v29"
- createEmptyProject()
- normalizeProject(project)
- getProjectSummary(project)
- safeGetProjectSection(project, sectionName, fallbackValue)

createEmptyProject musí vrátit základní prázdný projekt s:
projectId, dataModelVersion, appVersion, createdAt, updatedAt, projectInfo, building, roofs, fve, lps, cad, documents, exports, qa, migrationHistory.

normalizeProject:
- doplní chybějící sekce,
- zachová neznámá pole,
- nepoškodí původní data,
- doplní updatedAt,
- vrátí objekt { ok, project, warnings }.

getProjectSummary:
- vrátí stručný souhrn pro Project Inspector.

Po dokončení vytvoř commit:
v30 project model adapter
PROMPT

git add prompts/v30_PROJECT_MODEL_ADAPTER_TASK.txt
git commit -m "Add v30 project model adapter prompt" || true

run_task "v30 project model adapter" prompts/v30_PROJECT_MODEL_ADAPTER_TASK.txt \
  src/data/projectModel.js


cat > prompts/v30_SAMPLE_PROJECT_LOADER_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden soubor:
src/data/sampleProjectLoader.js

Přísná pravidla:
- Neměň HTML.
- Neměň CSS.
- Neměň preview.
- Neměň UI.
- Neměň Classic PRO vzhled.
- Neměň přepínání obrazovek.
- Neměň PROJECT_STATE_UNIFIED.md.
- Neměň CHANGELOG.md.
- Nemaž žádné soubory.
- Nepřidávej závislosti do package.json.
- Kód musí být bezpečný.

Soubor má importovat z:
src/data/projectModel.js

Soubor má exportovat:
- SAMPLE_PROJECT_PATHS
- getSampleProjectPath(sampleName)
- loadSampleProjectFromObject(rawProject)
- listKnownSampleProjects()

Poznámka:
V browser/preview prostředí zatím nenačítej soubory z disku. Připrav pouze helpery a cestovní mapu pro pozdější napojení.

SAMPLE_PROJECT_PATHS musí obsahovat:
- minimal
- fullFveLps
- roofGeometry
- qaWarning

Cesty:
database/sample-projects/v29/v29_minimal_project.json
database/sample-projects/v29/v29_full_fve_lps_project.json
database/sample-projects/v29/v29_roof_geometry_project.json
database/sample-projects/v29/v29_qa_warning_project.json

loadSampleProjectFromObject:
- zavolá normalizeProject,
- vrátí { ok, project, warnings, source }.

Po dokončení vytvoř commit:
v30 sample project loader
PROMPT

git add prompts/v30_SAMPLE_PROJECT_LOADER_TASK.txt
git commit -m "Add v30 sample project loader prompt" || true

run_task "v30 sample project loader" prompts/v30_SAMPLE_PROJECT_LOADER_TASK.txt \
  src/data/sampleProjectLoader.js src/data/projectModel.js


cat > prompts/v30_BASIC_PROJECT_VALIDATION_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden soubor:
src/validation/basicProjectValidation.js

Přísná pravidla:
- Neměň HTML.
- Neměň CSS.
- Neměň preview.
- Neměň UI.
- Neměň Classic PRO vzhled.
- Neměň přepínání obrazovek.
- Neměň PROJECT_STATE_UNIFIED.md.
- Neměň CHANGELOG.md.
- Nemaž žádné soubory.
- Nepřidávej závislosti do package.json.
- Bezpečné chování: žádná bílá obrazovka kvůli validační chybě.

Soubor má exportovat:
- VALIDATION_STATUS
- createValidationIssue(input)
- validateRequiredSections(project)
- validateDataModelVersion(project)
- validateProjectInfo(project)
- validateBasicProject(project)

validateBasicProject musí vracet:
{
  ok,
  status,
  errors,
  warnings,
  info,
  summary
}

Kontroly:
- project existuje,
- dataModelVersion existuje,
- projectId existuje,
- projectInfo existuje,
- hlavní sekce existují: building, roofs, fve, lps, cad, documents, exports, qa.
- při chybách vrátit errors, neházet výjimku.

Po dokončení vytvoř commit:
v30 basic project validation
PROMPT

git add prompts/v30_BASIC_PROJECT_VALIDATION_TASK.txt
git commit -m "Add v30 basic project validation prompt" || true

run_task "v30 basic project validation" prompts/v30_BASIC_PROJECT_VALIDATION_TASK.txt \
  src/validation/basicProjectValidation.js


cat > prompts/v30_REFERENCE_VALIDATION_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden soubor:
src/validation/referenceValidation.js

Přísná pravidla:
- Neměň HTML.
- Neměň CSS.
- Neměň preview.
- Neměň UI.
- Neměň Classic PRO vzhled.
- Neměň přepínání obrazovek.
- Neměň PROJECT_STATE_UNIFIED.md.
- Neměň CHANGELOG.md.
- Nemaž žádné soubory.
- Nepřidávej závislosti do package.json.
- Bezpečné chování.

Soubor má exportovat:
- collectEntityIds(project)
- validatePanelStringReferences(project)
- validateCadEntityReferences(project)
- validateQaEntityReferences(project)
- validateProjectReferences(project)

validateProjectReferences musí vracet:
{
  ok,
  status,
  errors,
  warnings,
  summary
}

Kontroly:
- panel.stringId existuje v strings,
- string.inverterId existuje v inverters,
- cad object layerId existuje v layers,
- qa relatedEntityRef nepadá při chybějícím objektu, ale vytvoří warning,
- žádná chyba nesmí shodit aplikaci.

Po dokončení vytvoř commit:
v30 reference validation
PROMPT

git add prompts/v30_REFERENCE_VALIDATION_TASK.txt
git commit -m "Add v30 reference validation prompt" || true

run_task "v30 reference validation" prompts/v30_REFERENCE_VALIDATION_TASK.txt \
  src/validation/referenceValidation.js


cat > prompts/v30_QA_STATUS_ENGINE_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden soubor:
src/validation/qaStatusEngine.js

Přísná pravidla:
- Neměň HTML.
- Neměň CSS.
- Neměň preview.
- Neměň UI.
- Neměň Classic PRO vzhled.
- Neměň přepínání obrazovek.
- Neměň PROJECT_STATE_UNIFIED.md.
- Neměň CHANGELOG.md.
- Nemaž žádné soubory.
- Nepřidávej závislosti do package.json.
- Bezpečné chování.

Soubor má importovat:
- validateBasicProject z basicProjectValidation.js
- validateProjectReferences z referenceValidation.js

Soubor má exportovat:
- QA_STATUS
- getWorstStatus(statuses)
- buildQaSummary(results)
- runProjectQa(project)

runProjectQa musí:
- spustit základní validaci,
- spustit referenční validaci,
- vrátit {
    ok,
    status,
    score,
    errors,
    warnings,
    checks,
    summary,
    createdAt
  }

Stavy:
ok, warning, error, critical, pending.

Po dokončení vytvoř commit:
v30 qa status engine
PROMPT

git add prompts/v30_QA_STATUS_ENGINE_TASK.txt
git commit -m "Add v30 qa status engine prompt" || true

run_task "v30 qa status engine" prompts/v30_QA_STATUS_ENGINE_TASK.txt \
  src/validation/qaStatusEngine.js src/validation/basicProjectValidation.js src/validation/referenceValidation.js


cat > prompts/v30_JSON_IMPORT_PREVIEW_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden soubor:
src/importExport/jsonImportPreview.js

Přísná pravidla:
- Neměň HTML.
- Neměň CSS.
- Neměň preview.
- Neměň UI.
- Neměň Classic PRO vzhled.
- Neměň přepínání obrazovek.
- Neměň PROJECT_STATE_UNIFIED.md.
- Neměň CHANGELOG.md.
- Nemaž žádné soubory.
- Nepřidávej závislosti do package.json.
- Import nesmí poškodit aktuální projekt.
- Import preview nesmí rovnou ukládat data.

Soubor má importovat:
- normalizeProject z src/data/projectModel.js
- runProjectQa z src/validation/qaStatusEngine.js

Soubor má exportovat:
- parseProjectJsonText(jsonText)
- createImportPreviewFromText(jsonText)
- createImportPreviewFromObject(rawObject)

createImportPreviewFromText:
- bezpečně parsuje JSON,
- při chybě vrací { ok:false, status:"error", errors:[...] },
- při úspěchu normalizuje projekt,
- spustí QA,
- vrátí preview objekt:
{
  ok,
  status,
  projectPreview,
  qa,
  warnings,
  errors,
  canImport
}

Po dokončení vytvoř commit:
v30 json import preview
PROMPT

git add prompts/v30_JSON_IMPORT_PREVIEW_TASK.txt
git commit -m "Add v30 json import preview prompt" || true

run_task "v30 json import preview" prompts/v30_JSON_IMPORT_PREVIEW_TASK.txt \
  src/importExport/jsonImportPreview.js src/data/projectModel.js src/validation/qaStatusEngine.js


cat > prompts/v30_JSON_EXPORT_HELPER_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden soubor:
src/importExport/jsonExportProject.js

Přísná pravidla:
- Neměň HTML.
- Neměň CSS.
- Neměň preview.
- Neměň UI.
- Neměň Classic PRO vzhled.
- Neměň přepínání obrazovek.
- Neměň PROJECT_STATE_UNIFIED.md.
- Neměň CHANGELOG.md.
- Nemaž žádné soubory.
- Nepřidávej závislosti do package.json.
- Export nesmí měnit původní projekt.
- Bezpečné chování.

Soubor má importovat:
- normalizeProject z src/data/projectModel.js
- runProjectQa z src/validation/qaStatusEngine.js

Soubor má exportovat:
- createProjectExportObject(project, options)
- stringifyProjectExport(project, options)
- createExportManifest(project, qa, options)

Export musí:
- normalizovat kopii projektu,
- doplnit export metadata,
- spustit QA,
- vrátit manifest,
- umět pretty JSON,
- při chybě vrátit { ok:false, errors:[...] }, neházet výjimku do UI.

Po dokončení vytvoř commit:
v30 json export helper
PROMPT

git add prompts/v30_JSON_EXPORT_HELPER_TASK.txt
git commit -m "Add v30 json export helper prompt" || true

run_task "v30 json export helper" prompts/v30_JSON_EXPORT_HELPER_TASK.txt \
  src/importExport/jsonExportProject.js src/data/projectModel.js src/validation/qaStatusEngine.js


cat > prompts/v30_DATA_LAYER_SMOKE_TESTS_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden soubor:
tests/data/v30_data_layer_smoke_test.js

Přísná pravidla:
- Neměň HTML.
- Neměň CSS.
- Neměň preview.
- Neměň UI.
- Neměň Classic PRO vzhled.
- Neměň přepínání obrazovek.
- Neměň PROJECT_STATE_UNIFIED.md.
- Neměň CHANGELOG.md.
- Nemaž žádné soubory.
- Nepřidávej závislosti do package.json.
- Test má být spustitelný přes node, pokud projekt používá ES moduly.
- Pokud není jasný module systém, napiš test jako dokumentovaný smoke test skript s bezpečným importem.

Test má ověřit:
- createEmptyProject vrací projekt,
- normalizeProject doplní sekce,
- validateBasicProject doběhne,
- runProjectQa doběhne,
- createImportPreviewFromObject doběhne,
- createProjectExportObject doběhne.

Test nesmí vyžadovat UI.
Test nesmí vyžadovat internet.
Test nesmí vytvářet build.

Po dokončení vytvoř commit:
v30 data layer smoke tests
PROMPT

git add prompts/v30_DATA_LAYER_SMOKE_TESTS_TASK.txt
git commit -m "Add v30 data layer smoke tests prompt" || true

run_task "v30 data layer smoke tests" prompts/v30_DATA_LAYER_SMOKE_TESTS_TASK.txt \
  tests/data/v30_data_layer_smoke_test.js src/data/projectModel.js src/validation/basicProjectValidation.js src/validation/qaStatusEngine.js src/importExport/jsonImportPreview.js src/importExport/jsonExportProject.js


cat > prompts/v30_DATA_LAYER_USAGE_GUIDE_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/data-layer/v30/v30_DATA_LAYER_USAGE_GUIDE.md

Přísná pravidla:
- Neměň HTML.
- Neměň CSS.
- Neměň preview.
- Neměň UI.
- Neměň Classic PRO vzhled.
- Neměň přepínání obrazovek.
- Neměň PROJECT_STATE_UNIFIED.md.
- Neměň CHANGELOG.md.
- Nemaž žádné soubory.
- Piš česky, technicky a prakticky.
- Výstup max 200 řádků.

Dokument musí popsat:
1. Co obsahuje v30 první datová vrstva.
2. projectModel.js.
3. sampleProjectLoader.js.
4. basicProjectValidation.js.
5. referenceValidation.js.
6. qaStatusEngine.js.
7. jsonImportPreview.js.
8. jsonExportProject.js.
9. smoke testy.
10. Jak to použít bez UI.
11. Jak to později napojit do Project Inspectoru.
12. Jak to později napojit do QA semaforu.
13. Jak to později napojit do import/export tlačítek.
14. Jak to chrání proti bílé obrazovce.
15. Rizika a další kroky.

Po dokončení vytvoř commit:
v30 data layer usage guide
PROMPT

git add prompts/v30_DATA_LAYER_USAGE_GUIDE_TASK.txt
git commit -m "Add v30 data layer usage guide prompt" || true

run_task "v30 data layer usage guide" prompts/v30_DATA_LAYER_USAGE_GUIDE_TASK.txt \
  docs/data-layer/v30/v30_DATA_LAYER_USAGE_GUIDE.md


echo ""
echo "=== HOTOVO: v30 first data layer implementation queue ==="
git status
git log --oneline -30

echo ""
echo "src/data:"
ls src/data || true

echo ""
echo "src/validation:"
ls src/validation || true

echo ""
echo "src/importExport:"
ls src/importExport || true

echo ""
echo "tests/data:"
ls tests/data || true
