#!/usr/bin/env bash
set -e

cd /d/Projekty/LOSKOT_FVE_LPS_STUDIO_PRO

echo "=== LOSKOT v30 data layer hardening + app bridge queue ==="

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

cat > prompts/v30_PROJECT_STORE_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden soubor:
src/data/projectStore.js

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
- Bezpečné chování: chyba dat nesmí shodit UI.

Soubor má importovat:
- createEmptyProject
- normalizeProject
- getProjectSummary
ze src/data/projectModel.js

Soubor má exportovat:
- createProjectStore(initialProject)
- createSafeProjectSnapshot(project)
- getProjectStoreSummary(store)

createProjectStore musí vracet objekt s metodami:
- getProject()
- setProject(nextProject)
- updateProject(updater)
- resetProject()
- getSummary()
- getWarnings()
- subscribe(listener)
- notify()

Pravidla:
- žádná metoda nesmí házet chybu do UI,
- při chybě vrátit bezpečný fallback,
- listeners volat přes try/catch,
- zachovat původní data,
- použít normalizeProject.

Po dokončení vytvoř commit:
v30 project store
PROMPT

git add prompts/v30_PROJECT_STORE_TASK.txt
git commit -m "Add v30 project store prompt" || true

run_task "v30 project store" prompts/v30_PROJECT_STORE_TASK.txt \
  src/data/projectStore.js src/data/projectModel.js


cat > prompts/v30_PROJECT_STATE_ADAPTER_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden soubor:
src/data/projectStateAdapter.js

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

Soubor má připravit bezpečný adapter mezi datovou vrstvou a budoucím UI.

Importuj:
- createProjectStore ze src/data/projectStore.js
- runProjectQa ze src/validation/qaStatusEngine.js

Exportuj:
- createAppProjectState(initialProject)
- getSafeInspectorData(appState)
- getSafeQaData(appState)
- getSafeModuleData(appState, moduleName)

createAppProjectState musí vracet objekt:
- store
- getInspectorData()
- getQaData()
- getModuleData(moduleName)
- setProject(project)
- updateProject(updater)

getSafeInspectorData má vracet:
- project summary
- projectInfo
- building summary
- counts: roofs, panels, strings, lps prvky, cad objects, documents, qa warnings

getSafeQaData:
- spustí runProjectQa
- při chybě vrátí warning/error objekt, ne výjimku.

Po dokončení vytvoř commit:
v30 project state adapter
PROMPT

git add prompts/v30_PROJECT_STATE_ADAPTER_TASK.txt
git commit -m "Add v30 project state adapter prompt" || true

run_task "v30 project state adapter" prompts/v30_PROJECT_STATE_ADAPTER_TASK.txt \
  src/data/projectStateAdapter.js src/data/projectStore.js src/validation/qaStatusEngine.js


cat > prompts/v30_DATA_INDEX_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř nebo uprav pouze jeden soubor:
src/data/index.js

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
- Nepřidávej závislosti.

Soubor má exportovat veřejné API datové vrstvy:
- vše důležité z projectModel.js
- vše důležité ze sampleProjectLoader.js
- vše důležité z projectStore.js
- vše důležité z projectStateAdapter.js

Použij přehledné ES module exporty.
Soubor nesmí obsahovat UI logiku.

Po dokončení vytvoř commit:
v30 data layer index
PROMPT

git add prompts/v30_DATA_INDEX_TASK.txt
git commit -m "Add v30 data index prompt" || true

run_task "v30 data layer index" prompts/v30_DATA_INDEX_TASK.txt \
  src/data/index.js src/data/projectModel.js src/data/sampleProjectLoader.js src/data/projectStore.js src/data/projectStateAdapter.js


cat > prompts/v30_VALIDATION_INDEX_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř nebo uprav pouze jeden soubor:
src/validation/index.js

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
- Nepřidávej závislosti.

Soubor má exportovat veřejné API validace:
- basicProjectValidation.js
- referenceValidation.js
- qaStatusEngine.js

Použij přehledné ES module exporty.
Soubor nesmí obsahovat UI logiku.

Po dokončení vytvoř commit:
v30 validation index
PROMPT

git add prompts/v30_VALIDATION_INDEX_TASK.txt
git commit -m "Add v30 validation index prompt" || true

run_task "v30 validation index" prompts/v30_VALIDATION_INDEX_TASK.txt \
  src/validation/index.js src/validation/basicProjectValidation.js src/validation/referenceValidation.js src/validation/qaStatusEngine.js


cat > prompts/v30_IMPORT_EXPORT_INDEX_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř nebo uprav pouze jeden soubor:
src/importExport/index.js

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
- Nepřidávej závislosti.

Soubor má exportovat veřejné API import/export vrstvy:
- jsonImportPreview.js
- jsonExportProject.js

Použij přehledné ES module exporty.
Soubor nesmí obsahovat UI logiku.

Po dokončení vytvoř commit:
v30 import export index
PROMPT

git add prompts/v30_IMPORT_EXPORT_INDEX_TASK.txt
git commit -m "Add v30 import export index prompt" || true

run_task "v30 import export index" prompts/v30_IMPORT_EXPORT_INDEX_TASK.txt \
  src/importExport/index.js src/importExport/jsonImportPreview.js src/importExport/jsonExportProject.js


cat > prompts/v30_DATA_LAYER_NODE_RUNNER_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden soubor:
tests/data/v30_data_layer_node_runner.js

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
- Test nesmí vyžadovat internet.
- Test nesmí vytvářet build.

Soubor má být jednoduchý ruční smoke runner pro Node.

Má otestovat:
- import z src/data/index.js
- import z src/validation/index.js
- import z src/importExport/index.js
- createEmptyProject
- normalizeProject
- createProjectStore
- createAppProjectState
- runProjectQa
- createImportPreviewFromObject
- createProjectExportObject

Pokud projektový module systém není jasný:
- napiš runner tak, aby měl jasné komentáře,
- použij bezpečný async main,
- chybu vypiš do console.error,
- process.exitCode = 1 při chybě,
- žádné UI.

Po dokončení vytvoř commit:
v30 data layer node runner
PROMPT

git add prompts/v30_DATA_LAYER_NODE_RUNNER_TASK.txt
git commit -m "Add v30 data layer node runner prompt" || true

run_task "v30 data layer node runner" prompts/v30_DATA_LAYER_NODE_RUNNER_TASK.txt \
  tests/data/v30_data_layer_node_runner.js src/data/index.js src/validation/index.js src/importExport/index.js


cat > prompts/v30_DATA_LAYER_INTEGRATION_STATUS_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/data-layer/v30/v30_DATA_LAYER_INTEGRATION_STATUS.md

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
- Výstup max 220 řádků.

Dokument musí popsat:
1. Co je ve v30 data layer hotové.
2. projectModel.
3. sampleProjectLoader.
4. projectStore.
5. projectStateAdapter.
6. basic validation.
7. reference validation.
8. QA status engine.
9. JSON import preview.
10. JSON export helper.
11. index soubory.
12. smoke testy.
13. Co ještě není napojené do UI.
14. Jak bezpečně napojit Project Inspector.
15. Jak bezpečně napojit QA semafor.
16. Jak bezpečně napojit import/export tlačítka.
17. Rizika.
18. Doporučený další krok.

Po dokončení vytvoř commit:
v30 data layer integration status
PROMPT

git add prompts/v30_DATA_LAYER_INTEGRATION_STATUS_TASK.txt
git commit -m "Add v30 data layer integration status prompt" || true

run_task "v30 data layer integration status" prompts/v30_DATA_LAYER_INTEGRATION_STATUS_TASK.txt \
  docs/data-layer/v30/v30_DATA_LAYER_INTEGRATION_STATUS.md


cat > prompts/v30_UI_PROJECT_INSPECTOR_SAFE_INTEGRATION_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Toto je prompt pro další bezpečný krok, zatím ho nespouštěj automaticky.

Cíl dalšího kroku:
Bezpečně napojit Project Inspector na v30 datovou vrstvu.

Přísná pravidla:
- Zachovat Classic PRO vzhled.
- Neměnit layout.
- Neměnit barvy.
- Neměnit menu.
- Neměnit přepínání obrazovek.
- Neměnit CAD preview vzhled.
- Neměnit mapu.
- Neměnit FVE/LPS/CAD interakce.
- Nesmí vzniknout bílá obrazovka.
- Každý import z datové vrstvy musí být obalen fallbackem.
- Při chybě zobrazit warning v Project Inspectoru, ne shodit aplikaci.
- Nejprve najít skutečný soubor Project Inspectoru.
- Zasáhnout jen minimálně.

Povolený cíl:
- pouze soubor/soubory Project Inspectoru po jejich ověření
- případně jeden malý adapter soubor

Zakázané:
- plošné přepisování App komponenty
- změny CSS
- změny preview HTML
- změny routeru/menu

Požadovaný výsledek:
- Project Inspector zobrazí summary z getSafeInspectorData
- pokud data nejsou k dispozici, zobrazí fallback
- UI zůstane stejné
- commit:
v30 safe project inspector data integration
PROMPT

git add prompts/v30_UI_PROJECT_INSPECTOR_SAFE_INTEGRATION_TASK.txt
git commit -m "Add v30 UI project inspector safe integration prompt" || true

git push

echo ""
echo "=== HOTOVO: v30 data layer hardening + app bridge queue ==="
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

echo ""
echo "docs/data-layer/v30:"
ls docs/data-layer/v30 || true
