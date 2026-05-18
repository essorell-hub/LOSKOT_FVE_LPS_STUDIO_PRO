import assert from "node:assert/strict";
import { assertRuntimeHealth, createRuntimeHealthSnapshot } from "../../src/runtime/postMegaRuntimeHealthCheck.mjs";

const snap = createRuntimeHealthSnapshot({ fve: { panels: [{ id: "P1" }] } });
assert.equal(snap.ok, true);
assert.equal(snap.counts.fvePanels, 1);
assert.equal(snap.visibleLayers.includes("cad"), true);
assert.equal(assertRuntimeHealth({}).ok, true);
console.log("POST-MEGA V4 runtime health smoke PASS");
