#!/usr/bin/env bash
set +e

cd /d/Projekty/LOSKOT_FVE_LPS_STUDIO_PRO

STAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="logs/night_autopilot_${STAMP}.log"

mkdir -p logs dist/night-build docs/night-build src/fve src/cad src/lps src/documents src/database src/export tests/fve tests/cad tests/lps tests/documents tests/database docs/fve docs/cad docs/lps docs/documents docs/database preview prompts

exec > >(tee -a "$LOG_FILE") 2>&1

echo "============================================================"
echo " LOSKOT FVE & LPS STUDIO PRO — NIGHT AUTOPILOT FULL"
echo " START: $STAMP"
echo "============================================================"

rm -f "git status" tatus

echo ""
echo "=== PRE-FLIGHT ==="
git status
git log --oneline -10

BACKUP_BRANCH="backup/night-autopilot-before-${STAMP}"
git branch "$BACKUP_BRANCH"
echo "Backup branch created: $BACKUP_BRANCH"

commit_if_needed () {
  local msg="$1"
  if [ -n "$(git status --short)" ]; then
    git add .
    git commit -m "$msg" || true
    git push || true
  fi
}

run_aider_task () {
  local task_name="$1"
  local prompt_file="$2"
  shift 2

  echo ""
  echo "============================================================"
  echo "AIDER START: $task_name"
  echo "============================================================"

  aider --yes-always --config .aider.conf.yml "$@" "$prompt_file" --message-file "$prompt_file" || true

  if [ -n "$(git status --short)" ]; then
    git add "$@" "$prompt_file" || true
    git commit -m "$task_name" || true
    git push || true
  fi

  echo "AIDER DONE: $task_name"
}

echo ""
echo "=== PHASE 1: PYTHON — CLEAN v31 FULL EDITOR PREVIEW ==="

python - <<'PY'
from pathlib import Path

src = Path("preview/LOSKOT_FVE_LPS_STUDIO_PRO_v28_WINDOWS_BUILD_PREVIEW.html")
dst = Path("preview/LOSKOT_FVE_LPS_STUDIO_PRO_v31_FULL_EDITOR_PREVIEW.html")

if not src.exists():
    raise SystemExit(f"Chybí zdrojový soubor: {src}")

html = src.read_text(encoding="utf-8")
html = html.replace("v27 PRODUCTION HANDOFF PACKAGING PREVIEW", "v31 FULL EDITOR PREVIEW")
html = html.replace("v28 WINDOWS BUILD PREVIEW", "v31 FULL EDITOR PREVIEW")

patch = r'''
<!-- V31_FULL_EDITOR_PREVIEW_PATCH -->
<script>
(function(){
  function esc(value){
    if(value === undefined || value === null) return "—";
    return String(value).replace(/[&<>"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];
    });
  }

  function byId(id){ return document.getElementById(id); }

  function ensureProject(){
    if(!window.project || typeof window.project !== "object") window.project = {};
    if(!window.project.fve || typeof window.project.fve !== "object") window.project.fve = {};
    if(!window.project.cad || typeof window.project.cad !== "object") window.project.cad = {};
    if(!window.project.lps || typeof window.project.lps !== "object") window.project.lps = {};
    return window.project;
  }

  function ensureFvePanels(){
    var p = ensureProject();
    if(!Array.isArray(p.fve.v31Panels)){
      p.fve.v31Panels = [];
      for(var i=0;i<18;i++){
        var col = i % 6;
        var row = Math.floor(i / 6);
        p.fve.v31Panels.push({
          id:"P-" + String(i+1).padStart(2,"0"),
          label:String(i+1),
          x:70 + col*70,
          y:74 + row*50,
          w:54,
          h:34,
          stringId:i < 9 ? "S1" : "S2"
        });
      }
    }
    if(!Array.isArray(window.v31SelectedPanelIds)) window.v31SelectedPanelIds = [];
    return p.fve.v31Panels;
  }

  function ensureCadLayers(){
    var p = ensureProject();
    if(!Array.isArray(p.cad.v31Layers)){
      p.cad.v31Layers = [
        {id:"roof", name:"Střecha", visible:true, locked:false, count:3},
        {id:"fve", name:"FVE panely", visible:true, locked:false, count:18},
        {id:"lps", name:"LPS jímací soustava", visible:true, locked:false, count:8},
        {id:"dc_route", name:"DC trasy", visible:true, locked:false, count:4},
        {id:"ac_route", name:"AC trasy", visible:true, locked:false, count:2},
        {id:"notes", name:"Poznámky", visible:true, locked:false, count:6}
      ];
    }
    return p.cad.v31Layers;
  }

  function ensureLpsObjects(){
    var p = ensureProject();
    if(!Array.isArray(p.lps.v31Objects)){
      p.lps.v31Objects = [
        {id:"J-01", type:"jímač", x:95, y:72, status:"ok"},
        {id:"J-02", type:"jímač", x:515, y:72, status:"ok"},
        {id:"J-03", type:"jímač", x:95, y:278, status:"warning"},
        {id:"J-04", type:"jímač", x:515, y:278, status:"ok"},
        {id:"S-01", type:"svod", x:75, y:175, status:"ok"},
        {id:"S-02", type:"svod", x:535, y:175, status:"ok"},
        {id:"HVI-01", type:"HVI", x:300, y:92, status:"review"}
      ];
    }
    return p.lps.v31Objects;
  }

  function selected(id){
    return window.v31SelectedPanelIds.indexOf(id) >= 0;
  }

  window.v31TogglePanelSelection = function(id){
    ensureFvePanels();
    var i = window.v31SelectedPanelIds.indexOf(id);
    if(i >= 0) window.v31SelectedPanelIds.splice(i, 1);
    else window.v31SelectedPanelIds.push(id);
    window.renderV31FveWorkspace();
  };

  window.v31SelectAllPanels = function(){
    window.v31SelectedPanelIds = ensureFvePanels().map(function(p){return p.id;});
    window.renderV31FveWorkspace();
  };

  window.v31SelectPartialPanels = function(){
    window.v31SelectedPanelIds = ensureFvePanels().filter(function(p,i){return i%2===0;}).map(function(p){return p.id;});
    window.renderV31FveWorkspace();
  };

  window.v31ClearPanelSelection = function(){
    window.v31SelectedPanelIds = [];
    window.renderV31FveWorkspace();
  };

  window.v31MoveSelectedPanels = function(dx, dy){
    var panels = ensureFvePanels();
    var moved = 0;
    panels.forEach(function(p){
      if(selected(p.id)){
        p.x = Number(p.x)+dx;
        p.y = Number(p.y)+dy;
        moved++;
      }
    });
    if(typeof window.log === "function") window.log("v31 FVE: posunuto panelů " + moved);
    window.renderV31FveWorkspace();
  };

  function roofSvgContent(extra){
    return `
      <svg viewBox="0 0 620 340" style="width:100%;height:390px;background:#07111c;border:1px solid #26384f;border-radius:14px">
        <rect x="42" y="38" width="510" height="245" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"></rect>
        <text x="58" y="62" fill="#94a3b8" font-size="12" font-family="monospace">v31 editor preview</text>
        ${extra}
      </svg>`;
  }

  function panelSvg(){
    return ensureFvePanels().map(function(p){
      var sel = selected(p.id);
      var fill = sel ? "#fbbf24" : "#1e40af";
      var stroke = sel ? "#fde68a" : "#93c5fd";
      var text = sel ? "#111827" : "#e0f2fe";
      return `
        <g onclick="v31TogglePanelSelection('${esc(p.id)}')" style="cursor:pointer">
          <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="2"></rect>
          <text x="${Number(p.x)+Number(p.w)/2}" y="${Number(p.y)+Number(p.h)/2+4}" text-anchor="middle" fill="${text}" font-size="11" font-family="monospace">${esc(p.label)}</text>
        </g>`;
    }).join("");
  }

  function fveStats(){
    var panels = ensureFvePanels();
    return `
      <table class="table">
        <tr><td>Panely celkem</td><td>${panels.length}</td></tr>
        <tr><td>Vybrané panely</td><td>${window.v31SelectedPanelIds.length}</td></tr>
        <tr><td>Stringy</td><td>2</td></tr>
        <tr><td>Režim</td><td>v31 bulk move</td></tr>
      </table>`;
  }

  window.renderV31FveWorkspace = function(){
    try{
      var view = byId("view");
      if(!view) return alert("Nenalezen hlavní panel view.");
      view.innerHTML = `
        <h1 class="module-title">FVE panely — výběr a hromadný přesun v31</h1>
        <div class="tools">
          <button class="primary" onclick="v31SelectAllPanels()">Označit vše</button>
          <button onclick="v31SelectPartialPanels()">Označit část</button>
          <button onclick="v31ClearPanelSelection()">Zrušit výběr</button>
          <button onclick="v31MoveSelectedPanels(-10,0)">←</button>
          <button onclick="v31MoveSelectedPanels(10,0)">→</button>
          <button onclick="v31MoveSelectedPanels(0,-10)">↑</button>
          <button onclick="v31MoveSelectedPanels(0,10)">↓</button>
        </div>
        <div class="split">
          <div class="card"><h2>CAD/FVE náhled</h2><div class="body">${roofSvgContent(panelSvg())}</div></div>
          <div class="card"><h2>Výběr panelů</h2><div class="body"><div class="notice">Klikni na panel pro výběr. Šipkami posuneš všechny vybrané panely.</div>${fveStats()}</div></div>
        </div>`;
      if(typeof window.inspector === "function") window.inspector();
      if(typeof window.qa === "function") window.qa();
    }catch(err){
      var view = byId("view");
      if(view) view.innerHTML = `<div class="fallback"><h2>FVE editor spadl bezpečně</h2><pre>${esc(err.message)}</pre></div>`;
    }
  };

  window.v31ToggleLayer = function(id){
    ensureCadLayers().forEach(function(l){ if(l.id===id && !l.locked) l.visible = !l.visible; });
    window.renderV31CadLayersWorkspace();
  };

  window.v31ToggleLayerLock = function(id){
    ensureCadLayers().forEach(function(l){ if(l.id===id) l.locked = !l.locked; });
    window.renderV31CadLayersWorkspace();
  };

  window.renderV31CadLayersWorkspace = function(){
    var layers = ensureCadLayers();
    var rows = layers.map(function(l){
      return `<tr>
        <td>${esc(l.name)}</td>
        <td>${l.visible ? "viditelná" : "skrytá"}</td>
        <td>${l.locked ? "zamčeno" : "odemčeno"}</td>
        <td>${esc(l.count)}</td>
        <td><button onclick="v31ToggleLayer('${esc(l.id)}')">${l.visible ? "Skrýt" : "Zobrazit"}</button></td>
        <td><button onclick="v31ToggleLayerLock('${esc(l.id)}')">${l.locked ? "Odemknout" : "Zamknout"}</button></td>
      </tr>`;
    }).join("");

    var view = byId("view");
    if(!view) return;
    view.innerHTML = `
      <h1 class="module-title">CAD vrstvy — v31 preview</h1>
      <div class="split">
        <div class="card"><h2>Správa vrstev</h2><div class="body">
          <table class="table"><tr><th>Vrstva</th><th>Viditelnost</th><th>Zámek</th><th>Objekty</th><th></th><th></th></tr>${rows}</table>
        </div></div>
        <div class="card"><h2>CAD náhled</h2><div class="body">${roofSvgContent('<text x="90" y="160" fill="#e0f2fe">CAD vrstvy v31 — bezpečný preview režim</text>')}</div></div>
      </div>`;
    if(typeof window.inspector === "function") window.inspector();
    if(typeof window.qa === "function") window.qa();
  };

  window.renderV31LpsWorkspace = function(){
    var objects = ensureLpsObjects();
    var items = objects.map(function(o){
      var color = o.type === "jímač" ? "#f97316" : o.type === "svod" ? "#22c55e" : "#a855f7";
      return `<g>
        <circle cx="${o.x}" cy="${o.y}" r="9" fill="${color}" stroke="#fff" stroke-width="1"></circle>
        <text x="${Number(o.x)+13}" y="${Number(o.y)+4}" fill="#e5e7eb" font-size="11">${esc(o.id)}</text>
      </g>`;
    }).join("");

    var rows = objects.map(function(o){
      return `<tr><td>${esc(o.id)}</td><td>${esc(o.type)}</td><td>${esc(o.status)}</td></tr>`;
    }).join("");

    var view = byId("view");
    if(!view) return;
    view.innerHTML = `
      <h1 class="module-title">LPS / DEHN objekty — v31 preview</h1>
      <div class="split">
        <div class="card"><h2>LPS náhled</h2><div class="body">${roofSvgContent(items)}</div></div>
        <div class="card"><h2>Objekty LPS</h2><div class="body">
          <table class="table"><tr><th>ID</th><th>Typ</th><th>Stav</th></tr>${rows}</table>
        </div></div>
      </div>`;
    if(typeof window.inspector === "function") window.inspector();
    if(typeof window.qa === "function") window.qa();
  };

  function addBtn(id, label, fn){
    if(document.getElementById(id)) return;
    var top = document.querySelector(".topbar, header, .head, .toolbar");
    if(!top){
      var divs = document.querySelectorAll("div");
      for(var i=0;i<divs.length;i++){
        var txt = divs[i].innerText || "";
        if(txt.indexOf("FVE aktivní") !== -1 || txt.indexOf("Safe Module Loader") !== -1){
          top = divs[i];
          break;
        }
      }
    }
    if(!top) top = document.body;
    var b = document.createElement("button");
    b.id = id;
    b.textContent = label;
    b.onclick = fn;
    b.style.marginLeft = "8px";
    b.style.border = "1px solid #36506b";
    b.style.background = "#0b1724";
    b.style.color = "#dbeafe";
    b.style.borderRadius = "10px";
    b.style.padding = "7px 12px";
    b.style.cursor = "pointer";
    top.appendChild(b);
  }

  function boot(){
    addBtn("v31CleanFvePanelsBtn", "v31 FVE panely", window.renderV31FveWorkspace);
    addBtn("v31CleanCadLayersBtn", "v31 CAD vrstvy", window.renderV31CadLayersWorkspace);
    addBtn("v31CleanLpsBtn", "v31 LPS objekty", window.renderV31LpsWorkspace);
    console.log("V31 full editor preview loaded");
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 300);
})();
</script>
'''

if "</body>" in html:
    html = html.replace("</body>", patch + "\n</body>", 1)
else:
    html += patch

dst.write_text(html, encoding="utf-8")
print("Created:", dst)
PY

git add preview/LOSKOT_FVE_LPS_STUDIO_PRO_v31_FULL_EDITOR_PREVIEW.html
git commit -m "Create clean v31 full editor preview" || true
git push || true

echo ""
echo "=== PHASE 2: AIDER — FVE / CAD / LPS / DOCUMENTS / DATABASE / EXPORT MODULES ==="

cat > prompts/night_FVE_PANEL_MODEL_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.
Vytvoř pouze soubor src/fve/panelSelectionModel.js.
Neměň HTML, CSS, preview, UI, PROJECT_STATE_UNIFIED.md ani CHANGELOG.md.
Nepřidávej závislosti.
Exportuj: createPanelSelectionState, selectAllPanels, selectPartialPanels, clearPanelSelection, togglePanelSelection, moveSelectedPanels, getPanelSelectionSummary.
Používej immutable-friendly kopie a bezpečné fallbacky.
PROMPT
run_aider_task "v31 fve panel selection model" prompts/night_FVE_PANEL_MODEL_TASK.txt src/fve/panelSelectionModel.js

cat > prompts/night_FVE_STRING_CALCULATOR_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.
Vytvoř pouze soubor src/fve/stringCalculator.js.
Neměň HTML, CSS, preview, UI, PROJECT_STATE_UNIFIED.md ani CHANGELOG.md.
Nepřidávej závislosti.
Exportuj: calculatePanelPowerKw, calculateStringTotals, calculateFveTotals, validateStringVoltage, createFveCalculationSummary.
Výsledky: panelCount, totalKwp, strings, warnings.
PROMPT
run_aider_task "v31 fve string calculator" prompts/night_FVE_STRING_CALCULATOR_TASK.txt src/fve/stringCalculator.js

cat > prompts/night_CAD_LAYER_MODEL_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.
Vytvoř pouze soubor src/cad/layerModel.js.
Neměň HTML, CSS, preview, UI, PROJECT_STATE_UNIFIED.md ani CHANGELOG.md.
Nepřidávej závislosti.
Exportuj: createDefaultCadLayers, normalizeCadLayers, toggleLayerVisibility, toggleLayerLock, getLayerObjectCounts, getVisibleUnlockedLayers.
Vrstvy: roof, fve, lps, dc_route, ac_route, notes, map.
PROMPT
run_aider_task "v31 cad layer model" prompts/night_CAD_LAYER_MODEL_TASK.txt src/cad/layerModel.js

cat > prompts/night_CAD_OBJECT_MODEL_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.
Vytvoř pouze soubor src/cad/objectModel.js.
Neměň HTML, CSS, preview, UI, PROJECT_STATE_UNIFIED.md ani CHANGELOG.md.
Nepřidávej závislosti.
Exportuj: createCadObject, normalizeCadObject, selectCadObject, clearCadSelection, moveCadObjects, getCadObjectSummary.
Podporuj geometryType: point, polyline, polygon, rect, circle.
PROMPT
run_aider_task "v31 cad object model" prompts/night_CAD_OBJECT_MODEL_TASK.txt src/cad/objectModel.js

cat > prompts/night_LPS_OBJECT_MODEL_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.
Vytvoř pouze soubor src/lps/lpsObjectModel.js.
Neměň HTML, CSS, preview, UI, PROJECT_STATE_UNIFIED.md ani CHANGELOG.md.
Nepřidávej závislosti.
Exportuj: createAirTerminal, createDownConductor, createHviRoute, createEarthingPoint, normalizeLpsObjects, getLpsObjectSummary, validateBasicLpsObjects.
Objekty: jímač, svod, HVI, zemnič, LPZ, SPD.
PROMPT
run_aider_task "v31 lps object model" prompts/night_LPS_OBJECT_MODEL_TASK.txt src/lps/lpsObjectModel.js

cat > prompts/night_LPS_RISK_PLACEHOLDER_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.
Vytvoř pouze soubor src/lps/riskAssessmentPlaceholder.js.
Neměň HTML, CSS, preview, UI, PROJECT_STATE_UNIFIED.md ani CHANGELOG.md.
Nepřidávej závislosti.
Neuváděj, že jde o plnohodnotný normový výpočet.
Exportuj: createRiskInputDefaults, estimateLpsClassPlaceholder, createRiskAssessmentSummary, validateRiskInput.
Vše označ jako placeholder pro budoucí normový výpočet.
PROMPT
run_aider_task "v31 lps risk assessment placeholder" prompts/night_LPS_RISK_PLACEHOLDER_TASK.txt src/lps/riskAssessmentPlaceholder.js

cat > prompts/night_DOCUMENT_MODEL_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.
Vytvoř pouze soubor src/documents/documentModel.js.
Neměň HTML, CSS, preview, UI, PROJECT_STATE_UNIFIED.md ani CHANGELOG.md.
Nepřidávej závislosti.
Exportuj: createDocumentDefinition, normalizeDocumentDefinition, createProjectDocumentSet, getRequiredDocumentsForProject, validateDocumentReadiness, createDocumentSummary.
Dokumenty: technická zpráva FVE, technická zpráva LPS, výpočet rizika, seznam zařízení, string report, SPD report, QA report, exportní protokol.
PROMPT
run_aider_task "v31 document model foundation" prompts/night_DOCUMENT_MODEL_TASK.txt src/documents/documentModel.js

cat > prompts/night_DATABASE_PROJECT_REPOSITORY_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.
Vytvoř pouze soubor src/database/projectRepositoryPreview.js.
Neměň HTML, CSS, preview, UI, PROJECT_STATE_UNIFIED.md ani CHANGELOG.md.
Nepřidávej závislosti.
Nepoužívej skutečné SQLite připojení, jde o preview repository vrstvu.
Exportuj: createEmptyProjectRecord, normalizeProjectRecord, saveProjectPreview, loadProjectPreview, listProjectsPreview, deleteProjectPreview, createRepositorySummary.
Store může být obyčejný JS objekt nebo Map fallback.
PROMPT
run_aider_task "v31 database project repository preview" prompts/night_DATABASE_PROJECT_REPOSITORY_TASK.txt src/database/projectRepositoryPreview.js

cat > prompts/night_EXPORT_PACKAGE_MODEL_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.
Vytvoř pouze soubor src/export/exportPackageModel.js.
Neměň HTML, CSS, preview, UI, PROJECT_STATE_UNIFIED.md ani CHANGELOG.md.
Nepřidávej závislosti.
Exportuj: createExportPackageManifest, addExportItem, validateExportPackageManifest, createExportPackageSummary.
Exportní položky: project-json, technical-report-pdf, technical-report-docx, drawings, datasheets, qa-report, database-backup, changelog.
PROMPT
run_aider_task "v31 export package model" prompts/night_EXPORT_PACKAGE_MODEL_TASK.txt src/export/exportPackageModel.js

cat > prompts/night_MODULE_INDEXES_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.
Vytvoř nebo uprav pouze soubory src/fve/index.js, src/cad/index.js, src/lps/index.js, src/documents/index.js, src/database/index.js, src/export/index.js.
Neměň HTML, CSS, preview, UI, PROJECT_STATE_UNIFIED.md ani CHANGELOG.md.
Nepřidávej závislosti.
Každý index má exportovat veřejné API svého modulu.
PROMPT
run_aider_task "v31 module indexes" prompts/night_MODULE_INDEXES_TASK.txt src/fve/index.js src/cad/index.js src/lps/index.js src/documents/index.js src/database/index.js src/export/index.js src/fve/panelSelectionModel.js src/fve/stringCalculator.js src/cad/layerModel.js src/cad/objectModel.js src/lps/lpsObjectModel.js src/lps/riskAssessmentPlaceholder.js src/documents/documentModel.js src/database/projectRepositoryPreview.js src/export/exportPackageModel.js

cat > prompts/night_SMOKE_TESTS_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.
Vytvoř pouze tyto soubory:
tests/fve/v31_fve_smoke_test.js
tests/cad/v31_cad_smoke_test.js
tests/lps/v31_lps_smoke_test.js
tests/documents/v31_document_model_smoke_test.js
tests/database/v31_database_repository_smoke_test.js
Neměň HTML, CSS, preview, UI, PROJECT_STATE_UNIFIED.md ani CHANGELOG.md.
Nepřidávej závislosti.
Testy mají být spustitelné přes node a mají ověřit základní importy a základní funkce modulů.
PROMPT
run_aider_task "v31 module smoke tests" prompts/night_SMOKE_TESTS_TASK.txt tests/fve/v31_fve_smoke_test.js tests/cad/v31_cad_smoke_test.js tests/lps/v31_lps_smoke_test.js tests/documents/v31_document_model_smoke_test.js tests/database/v31_database_repository_smoke_test.js src/fve/index.js src/cad/index.js src/lps/index.js src/documents/index.js src/database/index.js src/export/index.js

cat > prompts/night_DOCS_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.
Vytvoř pouze dokumenty:
docs/night-build/NIGHT_MAX_SAFE_PROGRESS_REPORT.md
docs/fve/v31_FVE_PANEL_EDITOR_NOTES.md
docs/cad/v31_CAD_LAYER_OBJECT_NOTES.md
docs/lps/v31_LPS_OBJECTS_NOTES.md
docs/documents/v31_DOCUMENT_MODULE_FOUNDATION.md
docs/database/v31_DATABASE_INTEGRATION_FOUNDATION.md
docs/night-build/v31_FULL_SYSTEM_INTEGRATION_PLAN.md
Neměň HTML, CSS, preview, UI, PROJECT_STATE_UNIFIED.md ani CHANGELOG.md.
Piš česky, technicky a prakticky.
Popiš: co vzniklo, co je funkční, co je preview, co je placeholder, rizika, další kroky k full verzi.
PROMPT
run_aider_task "v31 documentation pack" prompts/night_DOCS_TASK.txt docs/night-build/NIGHT_MAX_SAFE_PROGRESS_REPORT.md docs/fve/v31_FVE_PANEL_EDITOR_NOTES.md docs/cad/v31_CAD_LAYER_OBJECT_NOTES.md docs/lps/v31_LPS_OBJECTS_NOTES.md docs/documents/v31_DOCUMENT_MODULE_FOUNDATION.md docs/database/v31_DATABASE_INTEGRATION_FOUNDATION.md docs/night-build/v31_FULL_SYSTEM_INTEGRATION_PLAN.md

echo ""
echo "=== PHASE 3: TEST / VALIDATION / DUPLICITY CHECK ==="

node tests/fve/v31_fve_smoke_test.js || true
node tests/cad/v31_cad_smoke_test.js || true
node tests/lps/v31_lps_smoke_test.js || true
node tests/documents/v31_document_model_smoke_test.js || true
node tests/database/v31_database_repository_smoke_test.js || true

echo ""
echo "=== HTML CHECK ==="
grep -n "V31_FULL_EDITOR_PREVIEW_PATCH\|renderV31FveWorkspace\|renderV31CadLayersWorkspace\|renderV31LpsWorkspace" preview/LOSKOT_FVE_LPS_STUDIO_PRO_v31_FULL_EDITOR_PREVIEW.html || true

echo ""
echo "=== PHASE 4: FINAL REPORT AND ZIP ==="

python - <<'PY'
from pathlib import Path
from datetime import datetime
import subprocess
import zipfile

stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
report = Path(f"docs/night-build/NIGHT_RUN_RESULT_{stamp}.md")
zip_path = Path(f"dist/night-build/LOSKOT_FVE_LPS_STUDIO_PRO_NIGHT_BUILD_{stamp}.zip")

def run(cmd):
    try:
        return subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        return e.output

status = run("git status --short")
log = run("git log --oneline -60")

folders = [
    "preview",
    "src/fve",
    "src/cad",
    "src/lps",
    "src/documents",
    "src/database",
    "src/export",
    "tests",
    "docs/night-build",
    "docs/fve",
    "docs/cad",
    "docs/lps",
    "docs/documents",
    "docs/database",
    "prompts",
    "logs"
]

files = []
for folder in folders:
    p = Path(folder)
    if p.exists():
        for f in p.rglob("*"):
            if f.is_file():
                files.append(f)

report.write_text(
    "# NIGHT RUN RESULT\n\n"
    f"Čas: {stamp}\n\n"
    "## Git status\n\n```text\n" + status + "\n```\n\n"
    "## Poslední commity\n\n```text\n" + log + "\n```\n\n"
    "## Kontrolované soubory\n\n" +
    "\n".join(f"- `{x.as_posix()}`" for x in files[:500]) +
    "\n",
    encoding="utf-8"
)

zip_path.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for f in files:
        z.write(f, f.as_posix())
    z.write(report, report.as_posix())

print("Report:", report)
print("ZIP:", zip_path)
PY

git add .
git commit -m "Add night build result report and zip package" || true
git push || true

echo ""
echo "============================================================"
echo " NIGHT AUTOPILOT FINISHED"
echo "============================================================"
git status
git log --oneline -30

echo ""
echo "Preview files:"
ls preview | grep v31 || true

echo ""
echo "ZIP packages:"
ls dist/night-build || true

echo ""
echo "Log file:"
echo "$LOG_FILE"
