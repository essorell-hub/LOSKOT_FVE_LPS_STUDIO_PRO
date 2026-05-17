# v38 SELF CHECK RESULT

## Výsledek

v38 je bezpečně vytvořena jako samostatný preview soubor z funkční v37.

## Ověření

Ověřovací skript:

```bash
bash scripts/verify/verify_v38_preview.sh
cd /d/Projekty/LOSKOT_FVE_LPS_STUDIO_PRO

rm -f "git status" tatus

mkdir -p src/runtime tests/runtime docs/runtime/v39 prompts scripts/verify

cat > prompts/v39_RUNTIME_BRIDGE_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze soubor:
src/runtime/appRuntimeBridge.js

Přísná pravidla:
- Neměň HTML.
- Neměň CSS.
- Neměň preview.
- Neměň UI.
- Neměň PROJECT_STATE_UNIFIED.md.
- Neměň CHANGELOG.md.
- Nepřidávej závislosti.

Cíl:
Vytvořit bezpečný runtime bridge pro budoucí napojení UI na moduly ze src.

Bridge má být čistý JS modul bez DOM závislostí.

Použij existující moduly, pokud je bezpečně možné:
- src/workflow/index.js
- src/fve/index.js
- src/cad/index.js
- src/lps/index.js
- src/documents/index.js
- src/database/index.js
- src/export/index.js

Exportuj funkce:
- createRuntimeBridge(options)
- createRuntimeProject(input)
- runRuntimeWorkflow(project, options)
- runRuntimeQa(project, options)
- createRuntimeSummary(project, options)
- createRuntimeExport(project, options)
- saveRuntimeProject(store, project, options)
- loadRuntimeProject(store, projectId, options)
- createRuntimeDiagnostics(project, options)

Požadavky:
- žádná chyba nesmí být neodchycená
- vracet objekt { ok, data, warnings, errors }
- fallback, pokud importovaný modul neobsahuje očekávanou funkci
- jasně označit placeholdery
- nepředstírat hotový normový výpočet LPS
- české texty warningů/errors
PROMPT

git add prompts/v39_RUNTIME_BRIDGE_TASK.txt
git commit -m "Add v39 runtime bridge prompt" || true

aider --yes-always --config .aider.conf.yml \
  src/runtime/appRuntimeBridge.js \
  src/workflow/index.js \
  src/fve/index.js \
  src/cad/index.js \
  src/lps/index.js \
  src/documents/index.js \
  src/database/index.js \
  src/export/index.js \
  prompts/v39_RUNTIME_BRIDGE_TASK.txt \
  --message-file prompts/v39_RUNTIME_BRIDGE_TASK.txt || true

git add src/runtime/appRuntimeBridge.js prompts/v39_RUNTIME_BRIDGE_TASK.txt
git commit -m "v39 app runtime bridge" || true
git push

cat > prompts/v39_RUNTIME_TEST_DOCS_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř nebo uprav pouze tyto soubory:
src/runtime/index.js
tests/runtime/v39_runtime_bridge_smoke_test.js
docs/runtime/v39/v39_RUNTIME_BRIDGE.md
scripts/verify/verify_v39_runtime.sh

Přísná pravidla:
- Neměň HTML.
- Neměň CSS.
- Neměň preview.
- Neměň UI.
- Neměň PROJECT_STATE_UNIFIED.md.
- Neměň CHANGELOG.md.
- Nepřidávej závislosti.

Požadavky:
1. src/runtime/index.js exportuje public API z appRuntimeBridge.js.
2. Smoke test je spustitelný přes node.
3. Smoke test ověří:
   - createRuntimeBridge
   - createRuntimeProject
   - runRuntimeWorkflow
   - runRuntimeQa
   - createRuntimeSummary
   - createRuntimeExport
   - save/load runtime project
   - createRuntimeDiagnostics
4. verify skript spustí test a vypíše git status.
5. Dokumentace česky:
   - co runtime bridge řeší
   - co je funkční
   - co je fallback
   - jak se napojí v budoucnu do UI
   - co zůstává placeholder
PROMPT

git add prompts/v39_RUNTIME_TEST_DOCS_TASK.txt
git commit -m "Add v39 runtime test docs prompt" || true

aider --yes-always --config .aider.conf.yml \
  src/runtime/index.js \
  tests/runtime/v39_runtime_bridge_smoke_test.js \
  docs/runtime/v39/v39_RUNTIME_BRIDGE.md \
  scripts/verify/verify_v39_runtime.sh \
  src/runtime/appRuntimeBridge.js \
  prompts/v39_RUNTIME_TEST_DOCS_TASK.txt \
  --message-file prompts/v39_RUNTIME_TEST_DOCS_TASK.txt || true

chmod +x scripts/verify/verify_v39_runtime.sh 2>/dev/null || true

git add src/runtime/index.js tests/runtime/v39_runtime_bridge_smoke_test.js docs/runtime/v39/v39_RUNTIME_BRIDGE.md scripts/verify/verify_v39_runtime.sh prompts/v39_RUNTIME_TEST_DOCS_TASK.txt
git commit -m "v39 runtime bridge smoke test docs" || true
git push

echo ""
echo "=== SAMOKONTROLA v39 ==="
bash scripts/verify/verify_v39_runtime.sh || true

echo ""
echo "=== VŠECHNY ZÁKLADNÍ TESTY ==="
node tests/fve/v31_fve_smoke_test.js || true
node tests/cad/v31_cad_smoke_test.js || true
node tests/lps/v31_lps_smoke_test.js || true
node tests/documents/v31_document_model_smoke_test.js || true
node tests/database/v31_database_repository_smoke_test.js || true
node tests/workflow/v32_workflow_smoke_test.js || true
node tests/runtime/v39_runtime_bridge_smoke_test.js || true

echo ""
echo "=== FINÁLNÍ STAV v39 ==="
git status
git log --oneline -18
cd /d/Projekty/LOSKOT_FVE_LPS_STUDIO_PRO

rm -f "git status" tatus

mkdir -p docs/release/v40 docs/roadmap/v40 prompts scripts/verify

cat > docs/roadmap/v40/v40_FULL_APP_ROADMAP.md <<'EOF'
# v40 FULL APP ROADMAP

## Cíl

Dovést LOSKOT FVE & LPS STUDIO PRO z HTML preview a JS modulů do použitelné Windows aplikace.

## Aktuální stav po v39

- existuje datový model
- existují samostatné moduly FVE, CAD, LPS, dokumenty, databáze, export
- existuje workflow engine
- existuje runtime bridge
- existují smoke testy
- existují HTML preview verze v31 až v38
- existuje lokální import/export přes HTML preview
- existuje QA/self-check obrazovka

## Hrubý stav dokončení

| Oblast | Odhad |
|---|---:|
| Celý finální program | 55 % |
| Technický základ | 90 % |
| Datový model / workflow | 85 % |
| FVE základ | 58 % |
| CAD editor | 45 % |
| LPS / DEHN | 42 % |
| Dokumenty / databáze / export | 58 % |
| Windows/Tauri aplikace | 25 % |
| Finální odladění | 30 % |

## Nejbližší technické milníky

### v41 UI runtime bridge preview

Napojit HTML preview na runtime bridge bezpečně přes jeden samostatný adapter.

### v42 Project editor

Vytvořit formuláře pro projekt, investora, místo stavby a základní parametry.

### v43 FVE editor hardening

Vylepšit výběr panelů, posun, skupiny panelů, stringy a výkon.

### v44 CAD editor hardening

Zlepšit práci s vrstvami, objekty, výběrem a editací geometrie.

### v45 LPS editor hardening

Zlepšit jímače, svody, HVI, SPD, LPZ a napojení na CAD.

### v46 Document templates

Připravit technické zprávy, QA protokol, string report, SPD report.

### v47 SQLite/Tauri data layer

Napojit projektové ukládání na SQLite v Tauri aplikaci.

### v48 Windows packaging preview

Připravit první Windows build preview.

### v49 QA release candidate

Testování, chybové stavy, bílá obrazovka, import/export, UI lokalizace.

### v50 Internal beta

Použitelná interní beta pro běžné zakázkové testování.
