// MEGA PACK H — V101–V105 Equipment Catalog / Datasheet Engine smoke test

import fs from "node:fs";
import assert from "node:assert/strict";
import { equipmentCatalogCoreV101 } from "../../src/runtime/v101_v105_equipment_catalog_datasheet_engine/equipmentCatalogCoreV101.js";
import { datasheetIndexV102 } from "../../src/runtime/v101_v105_equipment_catalog_datasheet_engine/datasheetIndexV102.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const ok = loadJson("tests/fixtures/v101_v105_equipment_catalog_datasheet_engine/mega_h_ok.json");
const bad = loadJson("tests/fixtures/v101_v105_equipment_catalog_datasheet_engine/mega_h_bad.json");

const okResult = equipmentCatalogCoreV101(ok, { now: "TEST" });
assert.equal(okResult.status, "OK");

const badResult = datasheetIndexV102(bad, { now: "TEST" });
assert.equal(badResult.status, "BLOCKED");

console.log("===== LOSKOT MEGA PACK H SMOKE TEST =====");
console.log("OK_STATUS=" + okResult.status);
console.log("BAD_STATUS=" + badResult.status);
console.log("RESULT=OK");
