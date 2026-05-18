// MEGA PACK M — V126–V130 Security / Privacy / Permissions Audit smoke test

import fs from "node:fs";
import assert from "node:assert/strict";
import { sensitiveDataScannerV126 } from "../../src/runtime/v126_v130_security_privacy_permissions_audit/sensitiveDataScannerV126.js";
import { permissionPolicyV127 } from "../../src/runtime/v126_v130_security_privacy_permissions_audit/permissionPolicyV127.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const ok = loadJson("tests/fixtures/v126_v130_security_privacy_permissions_audit/mega_m_ok.json");
const bad = loadJson("tests/fixtures/v126_v130_security_privacy_permissions_audit/mega_m_bad.json");

const okResult = sensitiveDataScannerV126(ok, {"now": "TEST"});
assert.equal(okResult.status, "OK");

const badResult = permissionPolicyV127(bad, {"now": "TEST"});
assert.equal(badResult.status, "REVIEW_REQUIRED");

console.log("===== LOSKOT MEGA PACK M SMOKE TEST =====");
console.log("OK_STATUS=" + okResult.status);
console.log("BAD_STATUS=" + badResult.status);
console.log("RESULT=OK");
