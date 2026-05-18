// MEGA PACK L — V121–V125 Performance / Cache / Large Project Engine smoke test

import fs from "node:fs";
import assert from "node:assert/strict";
import { projectIndexCacheV121 } from "../../src/runtime/v121_v125_performance_cache_large_project_engine/projectIndexCacheV121.js";
import { largeProjectStatsV122 } from "../../src/runtime/v121_v125_performance_cache_large_project_engine/largeProjectStatsV122.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const ok = loadJson("tests/fixtures/v121_v125_performance_cache_large_project_engine/mega_l_ok.json");
const bad = loadJson("tests/fixtures/v121_v125_performance_cache_large_project_engine/mega_l_bad.json");

const okResult = projectIndexCacheV121(ok, {"hardLimit": 10000, "now": "TEST"});
assert.equal(okResult.status, "OK");

const badResult = largeProjectStatsV122(bad, {"hardLimit": 50, "now": "TEST"});
assert.equal(badResult.status, "LIMIT_EXCEEDED");

console.log("===== LOSKOT MEGA PACK L SMOKE TEST =====");
console.log("OK_STATUS=" + okResult.status);
console.log("BAD_STATUS=" + badResult.status);
console.log("RESULT=OK");
