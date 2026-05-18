// MEGA PACK J — V111–V115 Offline Work Queue / User Workflow Automation smoke test

import fs from "node:fs";
import assert from "node:assert/strict";
import { offlineWorkQueueV111 } from "../../src/runtime/v111_v115_offline_work_queue_automation/offlineWorkQueueV111.js";
import { workflowStepRegistryV112 } from "../../src/runtime/v111_v115_offline_work_queue_automation/workflowStepRegistryV112.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const ok = loadJson("tests/fixtures/v111_v115_offline_work_queue_automation/mega_j_ok.json");
const bad = loadJson("tests/fixtures/v111_v115_offline_work_queue_automation/mega_j_bad.json");

const okResult = offlineWorkQueueV111(ok, { now: "TEST" });
assert.equal(okResult.status, "OK");

const badResult = workflowStepRegistryV112(bad, { now: "TEST" });
assert.equal(badResult.status, "NEEDS_RECOVERY");

console.log("===== LOSKOT MEGA PACK J SMOKE TEST =====");
console.log("OK_STATUS=" + okResult.status);
console.log("BAD_STATUS=" + badResult.status);
console.log("RESULT=OK");
