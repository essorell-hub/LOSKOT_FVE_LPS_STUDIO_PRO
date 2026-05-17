
import assert from "node:assert/strict";
import {
  PROJECT_INSPECTOR_LAYERS_VERSION,
  createProjectInspectorLayers,
  safeProjectInspectorLayers
} from "../../src/runtime/projectInspectorLayers.js";

const model = createProjectInspectorLayers();
assert.equal(PROJECT_INSPECTOR_LAYERS_VERSION, "v52-project-inspector-layers");
assert.equal(model.classicProUnchanged, true);

const layers = model.listLayers();
assert.equal(layers.ok, true);
assert.ok(layers.data.length >= 8);

const hidden = model.setLayerVisibility("fve.panels", false);
assert.equal(hidden.ok, true);
assert.equal(hidden.data.visible, false);

const visible = model.toggleLayer("fve.panels");
assert.equal(visible.ok, true);
assert.equal(visible.data.visible, true);

const project = {
  fve: {
    panels: [
      { id: "P1", x: 10, y: 20, width: 32, height: 18, status: "OK" }
    ]
  },
  cad: {
    objects: [
      { id: "AT1", type: "lps-air-terminal", layerId: "lps.airTerminals", label: "Jímač 1" }
    ]
  }
};

const inspector = model.getInspectorItem(project, "P1");
assert.equal(inspector.ok, true);
assert.equal(inspector.data.type, "fve-panel");
assert.equal(inspector.data.classicProUnchanged, true);

const actions = model.getInspectorActions(project, "AT1");
assert.equal(actions.ok, true);
assert.ok(actions.data.includes("centerInCad"));

const summary = model.buildLayerSummary(project);
assert.equal(summary.ok, true);
assert.equal(summary.data.objectCount, 2);

const unsupported = model.run("missing", {});
assert.equal(unsupported.ok, false);

const safe = safeProjectInspectorLayers();
assert.equal(safe.run("listLayers").ok, true);

console.log("v52 project inspector layers smoke test OK");

