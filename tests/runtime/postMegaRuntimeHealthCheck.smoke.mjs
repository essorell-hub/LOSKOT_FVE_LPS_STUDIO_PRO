import assert from "node:assert/strict";
import { assertRuntimeHealth, createRuntimeHealthSnapshot } from "../../src/runtime/postMegaRuntimeHealthCheck.mjs";

const snap = createRuntimeHealthSnapshot({ fve: { panels: [{ id: "P1" }] } });
assert.equal(snap.ok, true);
assert.equal(snap.counts.fvePanels, 1);
assert.equal(snap.visibleLayers.includes("cad"), true);
assert.equal(assertRuntimeHealth({}).ok, true);

// V5C_READINESS_SAFEMODE_ASSERTION
const safeModeSnapshot = createRuntimeHealthSnapshot({ uiRuntime: { safeMode: false } });
assert.equal(safeModeSnapshot.ok, false);
assert.equal(safeModeSnapshot.findings.includes("safe_mode_disabled"), true);
assert.equal(assertRuntimeHealth({ uiRuntime: { safeMode: false } }).findings.includes("safe_mode_disabled"), true);
console.log("POST-MEGA V4 runtime health smoke PASS");
