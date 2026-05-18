// MEGA PACK F — V91–V95 Release Hardening / Diagnostics / Backup smoke test
// Run from repository root after SAFE PACK installation:
// node tests/runtime/v91_v95_release_hardening_smoke_test.js

import fs from "node:fs";
import assert from "node:assert/strict";
import { errorBoundaryStateV91 } from "../../src/runtime/v91_v95_release_hardening_diagnostics_backup/errorBoundaryStateV91.js";
import { diagnosticsCollectorV92 } from "../../src/runtime/v91_v95_release_hardening_diagnostics_backup/diagnosticsCollectorV92.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const ok = loadJson("tests/fixtures/v91_v95_release_hardening_diagnostics_backup/mega_f_ok.json");
const blocked = loadJson("tests/fixtures/v91_v95_release_hardening_diagnostics_backup/mega_f_blocked.json");

const okResult = errorBoundaryStateV91(ok, { now: "TEST" });
assert.equal(okResult.status, "OK");

const blockedResult = diagnosticsCollectorV92(blocked, { now: "TEST" });
assert.equal(blockedResult.status, "BLOCKED");
assert.ok(blockedResult.blocksExport > 0);

console.log("===== LOSKOT MEGA PACK F SMOKE TEST =====");
console.log("OK_STATUS=" + okResult.status);
console.log("BLOCKED_STATUS=" + blockedResult.status);
console.log("BLOCKS_EXPORT=" + blockedResult.blocksExport);
console.log("RESULT=OK");
