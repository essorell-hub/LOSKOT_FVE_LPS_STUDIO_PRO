import assert from "node:assert/strict";
import { DEVICE_DATASHEET_TYPES, createDatasheetRecord, validateDatasheetRecord, createDatasheetRegistrySummary } from "../../src/datasheets/postMegaDatasheetRegistry.mjs";

assert.equal(DEVICE_DATASHEET_TYPES.includes("pv_module"), true);
const rec = createDatasheetRecord({ id: "DS1", deviceType: "pv_module", manufacturer: "Test", model: "M1", filePath: "a.pdf", source: "manual", status: "ok" });
assert.equal(validateDatasheetRecord(rec).ok, true);
const missing = validateDatasheetRecord(createDatasheetRecord({ id: "DS2" }));
assert.equal(missing.ok, false);
const summary = createDatasheetRegistrySummary([rec]);
assert.equal(summary.byType.pv_module, 1);
console.log("POST-MEGA V4 datasheet registry smoke PASS");
