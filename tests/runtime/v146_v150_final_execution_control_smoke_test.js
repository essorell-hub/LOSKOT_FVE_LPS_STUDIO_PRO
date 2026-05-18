// MEGA PACK Q — V146–V150 Final Execution Control smoke test

import fs from "node:fs";
import assert from "node:assert/strict";
import { finalExecutionChecklistV146 } from "../../src/runtime/v146_v150_final_execution_control/finalExecutionChecklistV146.js";
import { homePcRunbookV147 } from "../../src/runtime/v146_v150_final_execution_control/homePcRunbookV147.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const ok = loadJson("tests/fixtures/v146_v150_final_execution_control/mega_q_ok.json");
const bad = loadJson("tests/fixtures/v146_v150_final_execution_control/mega_q_bad.json");

const okResult = finalExecutionChecklistV146(ok, { now: "TEST" });
assert.equal(okResult.status || okResult.finalStatus, "GO");

const badResult = homePcRunbookV147(bad, { now: "TEST" });
assert.equal(badResult.status || badResult.finalStatus, "STOP");

console.log("===== LOSKOT MEGA PACK Q SMOKE TEST =====");
console.log("OK_STATUS=" + (okResult.status || okResult.finalStatus));
console.log("BAD_STATUS=" + (badResult.status || badResult.finalStatus));
console.log("RESULT=OK");
