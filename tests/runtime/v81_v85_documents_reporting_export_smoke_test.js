// MEGA PACK E — V81–V85 Documents / Reporting / Export Upgrade smoke test
// Run from repository root after SAFE PACK installation:
// node tests/runtime/v81_v85_documents_reporting_export_smoke_test.js

import fs from "node:fs";
import assert from "node:assert/strict";
import { documentTemplateRegistryV81 } from "../../src/runtime/v81_v85_documents_reporting_export_upgrade/documentTemplateRegistryV81.js";
import { documentCompletenessCheckerV81 } from "../../src/runtime/v81_v85_documents_reporting_export_upgrade/documentCompletenessCheckerV81.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const ok = loadJson("tests/fixtures/v81_v85_documents_reporting_export_upgrade/mega_e_ok.json");
const blocked = loadJson("tests/fixtures/v81_v85_documents_reporting_export_upgrade/mega_e_blocked.json");

const okResult = documentTemplateRegistryV81(ok, { now: "TEST" });
assert.equal(okResult.status, "OK");

const blockedResult = documentCompletenessCheckerV81(blocked, { now: "TEST" });
assert.equal(blockedResult.status, "BLOCKED");
assert.ok(blockedResult.blocksExport > 0);

console.log("===== LOSKOT MEGA PACK E SMOKE TEST =====");
console.log("OK_STATUS=" + okResult.status);
console.log("BLOCKED_STATUS=" + blockedResult.status);
console.log("BLOCKS_EXPORT=" + blockedResult.blocksExport);
console.log("RESULT=OK");
