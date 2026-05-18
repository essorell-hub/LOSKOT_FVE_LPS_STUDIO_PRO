// MEGA PACK G — V96–V100 Windows Release Candidate Handoff smoke test
// Run from repository root after SAFE PACK installation:
// node tests/runtime/v96_v100_windows_release_candidate_smoke_test.js

import fs from "node:fs";
import assert from "node:assert/strict";
import { windowsReleaseChecklistV96 } from "../../src/runtime/v96_v100_windows_release_candidate_handoff/windowsReleaseChecklistV96.js";
import { candidateManifestV97 } from "../../src/runtime/v96_v100_windows_release_candidate_handoff/candidateManifestV97.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const ok = loadJson("tests/fixtures/v96_v100_windows_release_candidate_handoff/mega_g_ok.json");
const blocked = loadJson("tests/fixtures/v96_v100_windows_release_candidate_handoff/mega_g_blocked.json");

const okResult = windowsReleaseChecklistV96(ok, { now: "TEST" });
assert.equal(okResult.status, "OK");

const blockedResult = candidateManifestV97(blocked, { now: "TEST" });
assert.equal(blockedResult.status, "BLOCKED");
assert.ok(blockedResult.blocksExport > 0);

console.log("===== LOSKOT MEGA PACK G SMOKE TEST =====");
console.log("OK_STATUS=" + okResult.status);
console.log("BLOCKED_STATUS=" + blockedResult.status);
console.log("BLOCKS_EXPORT=" + blockedResult.blocksExport);
console.log("RESULT=OK");
