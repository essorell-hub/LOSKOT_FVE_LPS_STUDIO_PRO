import assert from "node:assert/strict";
import { getRuntimeLayerVisibilityMatrix, isRuntimeLayerVisible, installPostMegaLayerVisibilityBridge } from "../../src/runtime/postMegaLayerVisibilityBridge.mjs";

const api = installPostMegaLayerVisibilityBridge(globalThis);
assert.ok(api);
const matrix = getRuntimeLayerVisibilityMatrix({ layers: { cad: true, map: false, fve: true, lps: false } });
assert.equal(matrix.matrix.cad.visible, true);
assert.equal(matrix.matrix.map.visible, false);
assert.equal(isRuntimeLayerVisible({ layers: { documents: false } }, "documents"), false);
assert.equal(isRuntimeLayerVisible({ layers: { fve: true } }, "fve"), true);
console.log("POST-MEGA AUTOPILOT D layer bridge smoke PASS");
