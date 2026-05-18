// POST-MEGA RUNTIME INTEGRATION A
// Smoke test for guarded project model adapter.

import assert from "node:assert/strict";
import {
  createEmptyProjectModel,
  normalizeProjectModel,
  safeGetProjectModel,
  getVisibleLayerNames,
  POST_MEGA_PROJECT_MODEL_VERSION
} from "./projectModelAdapter.mjs";

const empty = createEmptyProjectModel();
assert.equal(empty.meta.schemaVersion, POST_MEGA_PROJECT_MODEL_VERSION);
assert.equal(empty.layers.cad, true);
assert.deepEqual(empty.fve.panels, []);
assert.deepEqual(empty.lps.rods, []);

const normalized = normalizeProjectModel({
  fve: { panels: [{ id: "P1" }], strings: "bad" },
  lps: { rods: [{ id: "R1" }] },
  layers: { documents: false }
});

assert.equal(normalized.fve.panels.length, 1);
assert.deepEqual(normalized.fve.strings, []);
assert.equal(normalized.lps.rods.length, 1);
assert.equal(normalized.layers.documents, false);

const safe = safeGetProjectModel({ projectModel: normalized });
assert.equal(safe.fve.panels[0].id, "P1");

const fallback = safeGetProjectModel(null);
assert.equal(fallback.uiRuntime.safeMode, true);

const visible = getVisibleLayerNames(normalized);
assert.equal(visible.includes("cad"), true);
assert.equal(visible.includes("documents"), false);

console.log("POST-MEGA runtime integration A adapter smoke PASS");
