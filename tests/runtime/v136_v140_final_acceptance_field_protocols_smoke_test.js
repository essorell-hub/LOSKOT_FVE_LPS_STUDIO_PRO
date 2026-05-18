// MEGA PACK O — V136–V140 Final Acceptance / Field Check Protocols smoke test

import fs from "node:fs";
import assert from "node:assert/strict";
import { fieldChecklistRegistryV136 } from "../../src/runtime/v136_v140_final_acceptance_field_check_protocols/fieldChecklistRegistryV136.js";
import { noVoltageProtocolModelV137 } from "../../src/runtime/v136_v140_final_acceptance_field_check_protocols/noVoltageProtocolModelV137.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const ok = loadJson("tests/fixtures/v136_v140_final_acceptance_field_check_protocols/mega_o_ok.json");
const bad = loadJson("tests/fixtures/v136_v140_final_acceptance_field_check_protocols/mega_o_bad.json");

const okResult = fieldChecklistRegistryV136(ok, {"now": "TEST"});
assert.equal(okResult.status, "ACCEPTED");

const badResult = noVoltageProtocolModelV137(bad, {"now": "TEST"});
assert.equal(badResult.status, "BLOCKED");

console.log("===== LOSKOT MEGA PACK O SMOKE TEST =====");
console.log("OK_STATUS=" + okResult.status);
console.log("BAD_STATUS=" + badResult.status);
console.log("RESULT=OK");
