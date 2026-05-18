// MEGA PACK K — V116–V120 Full Regression / Audit / Release Matrix smoke test

import fs from "node:fs";
import assert from "node:assert/strict";
import { regressionMatrixV116 } from "../../src/runtime/v116_v120_full_regression_audit_release_matrix/regressionMatrixV116.js";
import { testCoverageAuditV117 } from "../../src/runtime/v116_v120_full_regression_audit_release_matrix/testCoverageAuditV117.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const ok = loadJson("tests/fixtures/v116_v120_full_regression_audit_release_matrix/mega_k_ok.json");
const bad = loadJson("tests/fixtures/v116_v120_full_regression_audit_release_matrix/mega_k_bad.json");

const okResult = regressionMatrixV116(ok, { now: "TEST" });
assert.equal(okResult.status, "GO");

const badResult = testCoverageAuditV117(bad, { now: "TEST" });
assert.equal(badResult.status, "STOP");

console.log("===== LOSKOT MEGA PACK K SMOKE TEST =====");
console.log("OK_STATUS=" + okResult.status);
console.log("BAD_STATUS=" + badResult.status);
console.log("RESULT=OK");
