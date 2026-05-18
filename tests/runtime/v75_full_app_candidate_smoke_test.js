import assert from "node:assert/strict";
import {
  V75_FULL_APP_CANDIDATE_VERSION,
  createFullAppCandidateRuntime,
  safeFullAppCandidateRuntime
} from "../../src/runtime/fullAppCandidateRuntime.js";

assert.equal(V75_FULL_APP_CANDIDATE_VERSION, "v75-full-app-candidate");

const engine = createFullAppCandidateRuntime();
assert.equal(engine.classicProUnchanged, true);

const project = {
  fve: { panels: [{ id: "P1" }] },
  cad: { objects: [{ id: "C1" }] },
  lps: { objects: [{ id: "L1" }] },
  documents: [{ id: "D1" }],
  qa: { status: "PASS" },
  export: { packages: [{ id: "E1" }] }
};

const purpose = engine.getPurpose();
assert.equal(purpose.ok, true);
assert.equal(purpose.data.classicProUnchanged, true);

const status = engine.getIntegrationStatus(project);
assert.equal(status.ok, true);
assert.equal(status.data.percent, 100);

const packet = engine.buildSafeUiPacket(project);
assert.equal(packet.ok, true);
assert.equal(packet.data.panels.length, 7);

const guard = engine.validateNoWhiteScreen(project);
assert.equal(guard.ok, true);
assert.equal(guard.data.pass, true);
assert.equal(guard.data.fallbackAvailable, true);

const plan = engine.buildNextStepPlan({});
assert.equal(plan.ok, true);
assert.ok(plan.data.missing.length > 0);

assert.equal(engine.run("missing", {}).ok, false);
assert.equal(safeFullAppCandidateRuntime().run("getPurpose").ok, true);

console.log("v75 full-app-candidate smoke test OK");

