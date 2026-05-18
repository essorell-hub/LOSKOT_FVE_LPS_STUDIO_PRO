// MEGA PACK N — V131–V135 Collaboration / Handoff / Review Engine smoke test

import fs from "node:fs";
import assert from "node:assert/strict";
import { reviewChecklistV131 } from "../../src/runtime/v131_v135_collaboration_handoff_review_engine/reviewChecklistV131.js";
import { handoffStateV132 } from "../../src/runtime/v131_v135_collaboration_handoff_review_engine/handoffStateV132.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const ok = loadJson("tests/fixtures/v131_v135_collaboration_handoff_review_engine/mega_n_ok.json");
const bad = loadJson("tests/fixtures/v131_v135_collaboration_handoff_review_engine/mega_n_bad.json");

const okResult = reviewChecklistV131(ok, {"now": "TEST"});
assert.equal(okResult.status, "READY");

const badResult = handoffStateV132(bad, {"now": "TEST"});
assert.equal(badResult.status, "REVIEW_OPEN");

console.log("===== LOSKOT MEGA PACK N SMOKE TEST =====");
console.log("OK_STATUS=" + okResult.status);
console.log("BAD_STATUS=" + badResult.status);
console.log("RESULT=OK");
