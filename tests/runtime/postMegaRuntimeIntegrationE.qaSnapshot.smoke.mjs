import assert from "node:assert/strict";
import { createRuntimeQaSnapshot, installPostMegaRuntimeQaSnapshotBridge } from "../../src/runtime/postMegaRuntimeQaSnapshotBridge.mjs";

const api = installPostMegaRuntimeQaSnapshotBridge(globalThis);
assert.ok(api);
const snap = createRuntimeQaSnapshot({ meta: { id: "QA1" }, fve: { panels: [{ id: "P1" }] }, documents: { items: [{ id: "D1" }] } });
assert.equal(snap.safeMode, true);
assert.equal(snap.counts.fvePanels, 1);
assert.equal(snap.counts.documents, 1);
assert.equal(snap.warnings.includes("missing_project_id"), false);
console.log("POST-MEGA AUTOPILOT E QA snapshot bridge smoke PASS");
