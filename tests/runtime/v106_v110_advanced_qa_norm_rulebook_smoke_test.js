// MEGA PACK I — V106–V110 Advanced QA / Norm Rulebook Engine smoke test

import fs from "node:fs";
import assert from "node:assert/strict";
import { qaRulebookCoreV106 } from "../../src/runtime/v106_v110_advanced_qa_norm_rulebook_engine/qaRulebookCoreV106.js";
import { normReferenceRegistryV107 } from "../../src/runtime/v106_v110_advanced_qa_norm_rulebook_engine/normReferenceRegistryV107.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const ok = loadJson("tests/fixtures/v106_v110_advanced_qa_norm_rulebook_engine/mega_i_ok.json");
const bad = loadJson("tests/fixtures/v106_v110_advanced_qa_norm_rulebook_engine/mega_i_bad.json");

const okResult = qaRulebookCoreV106(ok, { now: "TEST" });
assert.equal(okResult.status, "OK");

const badResult = normReferenceRegistryV107(bad, { now: "TEST" });
assert.equal(badResult.status, "ACTIVE");

console.log("===== LOSKOT MEGA PACK I SMOKE TEST =====");
console.log("OK_STATUS=" + okResult.status);
console.log("BAD_STATUS=" + badResult.status);
console.log("RESULT=OK");
