
import assert from "node:assert/strict";
import { LPS_SPD_DATA_ENGINE_VERSION, createLpsSpdDataEngine, safeLpsSpdDataEngine } from "../../src/runtime/lpsSpdDataEngine.js";

assert.equal(LPS_SPD_DATA_ENGINE_VERSION, "v56-lps-spd-data-engine");
const engine = createLpsSpdDataEngine();
assert.equal(engine.classicProUnchanged, true);

const project = { lps: { objects: [{ id: "AT1", type: "airTerminal" }], spd: [{ id: "SPD1", type: "T1+T2", side: "AC", lpzFrom: "LPZ0", lpzTo: "LPZ1" }], lpz: [{ id: "LPZ1" }] } };
const summary = engine.buildLpsSummary(project);
assert.equal(summary.ok, true);
assert.equal(summary.data.componentCount, 1);
assert.equal(summary.data.spdCount, 1);
assert.equal(summary.data.riskAssessmentNormative, false);

const validation = engine.validateSpdCoordination(project);
assert.equal(validation.ok, true);
assert.equal(validation.data.status, "PASS");

const candidates = engine.buildDehnDeviceCandidates(project);
assert.equal(candidates.ok, true);
assert.equal(candidates.data.candidates[0].manufacturerPreferred, "DEHN");

const sync = engine.buildSqliteSyncPayload(project);
assert.equal(sync.ok, true);
assert.equal(sync.data.spd_devices.length, 1);

const doc = engine.buildDocumentContext(project);
assert.equal(doc.ok, true);
assert.equal(doc.data.classicProUnchanged, true);

assert.equal(engine.run("missing", {}).ok, false);
assert.equal(safeLpsSpdDataEngine().run("listLpsTypes").ok, true);
console.log("v56 lps spd data engine smoke test OK");

