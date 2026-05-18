// MEGA PACK P — V141–V145 Master Integration Orchestrator smoke test

import fs from "node:fs";
import assert from "node:assert/strict";
import { integrationDependencyGraphV141 } from "../../src/runtime/v141_v145_master_integration_orchestrator/integrationDependencyGraphV141.js";
import { megaPackSequencePlannerV142 } from "../../src/runtime/v141_v145_master_integration_orchestrator/megaPackSequencePlannerV142.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const ok = loadJson("tests/fixtures/v141_v145_master_integration_orchestrator/mega_p_ok.json");
const bad = loadJson("tests/fixtures/v141_v145_master_integration_orchestrator/mega_p_bad.json");

const okResult = integrationDependencyGraphV141(ok, { now: "TEST" });
assert.equal(okResult.status || okResult.finalStatus, "GO");

const badResult = megaPackSequencePlannerV142(bad, { now: "TEST" });
assert.equal(badResult.status || badResult.finalStatus, "STOP");

console.log("===== LOSKOT MEGA PACK P SMOKE TEST =====");
console.log("OK_STATUS=" + (okResult.status || okResult.finalStatus));
console.log("BAD_STATUS=" + (badResult.status || badResult.finalStatus));
console.log("RESULT=OK");
