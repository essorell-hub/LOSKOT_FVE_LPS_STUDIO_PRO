// LOSKOT V74-V85 Classic PRO UI Binding Smoke Test
// Run from repository root after SAFE PACK installation:
// node tests/runtime/v74_v85_classic_pro_ui_binding_smoke_test.js

import fs from "node:fs";
import assert from "node:assert/strict";
import {
  buildClassicProAppShellV74,
  safeBuildClassicProAppShellV74,
  buildDashboardViewModelV74,
  buildQaPanelViewModelV74,
  buildProjectInspectorViewModelV74,
  buildCadLayerViewModelV74,
  buildDocumentExportViewModelV74,
} from "../../src/runtime/v74v85/index.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const okProject = loadJson("tests/fixtures/v74_v85/mega_c_ui_project_ok.json");
const blockedProject = loadJson("tests/fixtures/v74_v85/mega_c_ui_project_blocked.json");

const shell = buildClassicProAppShellV74(okProject, { selectedObjectId: "cad_panel_01" });
assert.equal(shell.uiStyle, "Classic PRO");
assert.equal(shell.noWhiteScreenGuard, true);
assert.equal(shell.screens.dashboard.cards.length, 6);
assert.equal(shell.screens.documentsExport.exportBlocked, false);

const dashboard = buildDashboardViewModelV74(okProject);
assert.equal(dashboard.classicProSafe, true);
assert.ok(dashboard.actions.find((item) => item.id === "export_package").enabled);

const qaPanel = buildQaPanelViewModelV74(blockedProject.qa.results);
assert.equal(qaPanel.summary.blocksExport, 1);
assert.equal(qaPanel.summary.status, "BLOCKED");

const blockedDocuments = buildDocumentExportViewModelV74(blockedProject, qaPanel);
assert.equal(blockedDocuments.exportBlocked, true);
assert.equal(blockedDocuments.buttons.find((item) => item.id === "full_package_export").enabled, false);

const inspector = buildProjectInspectorViewModelV74(okProject, "cad_panel_01");
assert.equal(inspector.selectedCadObject.id, "cad_panel_01");
assert.equal(inspector.linkedData.id, "panel_01");

const layers = buildCadLayerViewModelV74(okProject);
assert.ok(layers.layers.length >= 5);

const safeErrorShell = safeBuildClassicProAppShellV74(null, {});
assert.equal(safeErrorShell.noWhiteScreenGuard, true);

console.log("===== LOSKOT V74-V85 CLASSIC PRO UI BINDING SMOKE TEST =====");
console.log("DASHBOARD_CARDS=" + shell.screens.dashboard.cards.length);
console.log("QA_BLOCKS_EXPORT=" + qaPanel.summary.blocksExport);
console.log("DOCUMENT_EXPORT_BLOCKED=" + blockedDocuments.exportBlocked);
console.log("CAD_LAYERS=" + layers.layers.length);
console.log("RESULT=OK");
