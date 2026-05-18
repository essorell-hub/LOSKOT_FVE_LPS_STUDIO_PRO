// LOSKOT V86-V90 CAD / Map Deep Integration Smoke Test
// Run from repository root after SAFE PACK installation:
// node tests/runtime/v86_v90_cad_map_deep_integration_smoke_test.js

import fs from "node:fs";
import assert from "node:assert/strict";
import {
  buildCadObjectRegistryV86,
  getCadObjectByIdV86,
  listCadObjectsByLayerV86,
  selectCadObjectV86,
  buildCadSelectionInspectorV86,
  validateCadDataLinksV86,
  buildCadLayerStateV86,
  toggleCadLayerVisibilityV86,
  mapQaToCadHighlightsV86,
  buildMapBridgeViewModelV86,
  hasMapCoordinatesV86,
} from "../../src/runtime/v86v90/index.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const okProject = loadJson("tests/fixtures/v86_v90/mega_d_cad_project_ok.json");
const badProject = loadJson("tests/fixtures/v86_v90/mega_d_cad_project_bad_links.json");

const registry = buildCadObjectRegistryV86(okProject);
assert.ok(registry.count >= 20);
assert.equal(getCadObjectByIdV86(okProject, "cad_panel_01").linkedId, "panel_01");
assert.ok(listCadObjectsByLayerV86(okProject, "10_fve_panels").length >= 18);

const selection = selectCadObjectV86(okProject, "cad_panel_01");
assert.equal(selection.selected, true);
assert.equal(selection.linkedData.id, "panel_01");

const highlights = mapQaToCadHighlightsV86(okProject, okProject.qa.results);
assert.ok(highlights.count >= 1);
assert.ok(highlights.blockingCount >= 1);

const inspector = buildCadSelectionInspectorV86(selection, highlights.highlights.map((h) => ({
  objectId: h.cadObjectId,
  blocksExport: h.blocksExport,
})));
assert.equal(inspector.selected, true);

const linkCheckOk = validateCadDataLinksV86(okProject);
assert.equal(linkCheckOk.summary.status, "OK");

const linkCheckBad = validateCadDataLinksV86(badProject);
assert.equal(linkCheckBad.summary.status, "BLOCKED");
assert.ok(linkCheckBad.summary.blocksExport > 0);

const layers = buildCadLayerStateV86(okProject);
assert.ok(layers.layers.length >= 6);
const toggled = toggleCadLayerVisibilityV86({}, "10_fve_panels");
assert.equal(toggled["10_fve_panels"].visible, false);

const mapVm = buildMapBridgeViewModelV86(okProject);
assert.equal(hasMapCoordinatesV86(okProject), true);
assert.ok(mapVm.objectCount >= 1);

console.log("===== LOSKOT V86-V90 CAD MAP DEEP INTEGRATION SMOKE TEST =====");
console.log("CAD_OBJECTS=" + registry.count);
console.log("CAD_LAYERS=" + layers.layers.length);
console.log("QA_HIGHLIGHTS=" + highlights.count);
console.log("BAD_LINK_BLOCKS=" + linkCheckBad.summary.blocksExport);
console.log("MAP_OBJECTS=" + mapVm.objectCount);
console.log("RESULT=OK");
