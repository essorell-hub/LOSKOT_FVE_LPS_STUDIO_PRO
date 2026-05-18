// POST-MEGA AUTOPILOT B3
// Smoke test for ESM read-only runtime project model bridge.

import assert from "node:assert/strict";
import {
  POST_MEGA_RUNTIME_BRIDGE_VERSION,
  installPostMegaRuntimeProjectModelBridge,
  normalizeRuntimeProjectModel,
  createRuntimeProjectModel,
  getRuntimeVisibleLayers
} from "../../src/runtime/postMegaRuntimeProjectModelBridge.mjs";

assert.equal(POST_MEGA_RUNTIME_BRIDGE_VERSION, "post-mega-autopilot-b3");

const api = installPostMegaRuntimeProjectModelBridge(globalThis);
assert.ok(api);
assert.equal(api.version, POST_MEGA_RUNTIME_BRIDGE_VERSION);
assert.ok(globalThis.LOSKOT_POST_MEGA_RUNTIME_PROJECT_MODEL_BRIDGE);

const empty = createRuntimeProjectModel();
assert.equal(empty.uiRuntime.safeMode, true);

const model = normalizeRuntimeProjectModel({
  fve: { panels: [{ id: "P1" }] },
  layers: { documents: false }
});

assert.equal(model.fve.panels.length, 1);
assert.equal(model.layers.documents, false);

const visible = getRuntimeVisibleLayers(model);
assert.equal(visible.includes("cad"), true);
assert.equal(visible.includes("documents"), false);

console.log("POST-MEGA AUTOPILOT B3 bridge smoke PASS");
