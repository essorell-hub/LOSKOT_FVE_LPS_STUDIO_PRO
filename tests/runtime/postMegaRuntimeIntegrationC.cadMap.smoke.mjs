import assert from "node:assert/strict";
import { createCadMapRuntimeSnapshot, installPostMegaCadMapModelBridge } from "../../src/runtime/postMegaCadMapModelBridge.mjs";

const api = installPostMegaCadMapModelBridge(globalThis);
assert.ok(api);
const snap = createCadMapRuntimeSnapshot({ fve: { panels: [{ id: "P1" }, { id: "P2" }] }, lps: { objects: [{ id: "J1" }] }, layers: { map: false } });
assert.equal(snap.fvePanelCount, 2);
assert.equal(snap.lpsObjectCount, 1);
assert.equal(snap.visibleLayers.includes("cad"), true);
assert.equal(snap.visibleLayers.includes("map"), false);
assert.equal(snap.safeMode, true);
console.log("POST-MEGA AUTOPILOT C CAD/MAPA bridge smoke PASS");
