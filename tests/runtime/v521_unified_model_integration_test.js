import assert from "node:assert";
import { readFileSync } from "node:fs";

import { normalizeUnifiedProject } from "../../src/data/unifiedProjectModelV501.js";
import { evaluateUnifiedFve } from "../../src/fve/unifiedFveAdapterV511.js";
import { normalizeUnifiedCad } from "../../src/cad/unifiedCadAdapterV512.js";
import { evaluateUnifiedLpsSpd } from "../../src/lps/unifiedLpsSpdAdapterV513.js";
import { createUnifiedDocumentSet } from "../../src/documents/unifiedDocumentsAdapterV514.js";
import { toRepositoryPreviewRecord, createSqliteMappingSummary, SQLITE_SCHEMA_PATH_V425 } from "../../src/database/unifiedRepositoryAdapterV516.js";
import { runUnifiedWorkflowPreview } from "../../src/workflow/unifiedWorkflowAdapterV517.js";

const fixture = JSON.parse(readFileSync("tests/fixtures/v501_v530/unified_project_ok.json", "utf8"));
const project = normalizeUnifiedProject(fixture);

const fve = evaluateUnifiedFve(project);
assert.strictEqual(fve.strings.length, 1);
assert.strictEqual(Math.round(fve.strings[0].result.vocCold * 10) / 10, 439.2);
assert.strictEqual(fve.releaseGo, true);

const overVoltage = evaluateUnifiedFve({
  ...project,
  fve: { ...project.fve, strings: [{ ...project.fve.strings[0], moduleCount: 15 }] },
});
assert.ok(overVoltage.qaFindings.some((finding) => finding.code === "QA-FVE-002"));

const cad = normalizeUnifiedCad(project);
assert.ok(cad.layers.length >= 1);
assert.strictEqual(cad.objects.length, 1);
assert.strictEqual(cad.qaFindings.length, 0);

const lpsSpd = evaluateUnifiedLpsSpd(project);
assert.strictEqual(lpsSpd.spd.qaFindings.length, 0);
assert.strictEqual(lpsSpd.riskAssessment.normative, false);
assert.ok(lpsSpd.qaFindings.some((finding) => finding.code === "V513-LPS-RISK-PLACEHOLDER"));

const badSpd = evaluateUnifiedLpsSpd({
  ...project,
  spd: { devices: [{ id: "bad", type: "TX" }], lpz: [] },
  grounding: { connected: false },
  bonding: { connected: false },
});
assert.ok(badSpd.qaFindings.some((finding) => finding.code === "QA-SPD-007"));
assert.strictEqual(badSpd.releaseGo, false);

const documents = createUnifiedDocumentSet(project);
assert.ok(documents.requiredTypes.includes("FVE_TECHNICAL_REPORT"));
assert.ok(documents.documents.length >= 1);

const record = toRepositoryPreviewRecord(project);
assert.strictEqual(record.id, "LOCAL-V501-001");
assert.strictEqual(record.fve.strings.length, 1);

const sql = createSqliteMappingSummary(project);
assert.strictEqual(sql.schemaPath, SQLITE_SCHEMA_PATH_V425);
assert.strictEqual(sql.tables.pv_strings, 1);
assert.strictEqual(sql.tables.spd_devices, 2);

const workflow = runUnifiedWorkflowPreview(project);
assert.strictEqual(workflow.classicProUnchanged, true);
assert.strictEqual(workflow.summary.counts.strings, 1);
assert.strictEqual(workflow.export.manifest.projectId, "LOCAL-V501-001");

console.log("V521_UNIFIED_MODEL_INTEGRATION_TEST=PASS");
