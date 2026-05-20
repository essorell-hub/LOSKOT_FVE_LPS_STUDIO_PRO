import assert from "node:assert";
import { readFileSync } from "node:fs";

import { normalizeUnifiedProject } from "../../src/data/unifiedProjectModelV501.js";
import { createUnifiedExportManifest } from "../../src/export/unifiedExportAdapterV515.js";
import { runUnifiedProjectQa } from "../../src/data/unifiedProjectQaAdapterV506.js";

const fixture = JSON.parse(readFileSync("tests/fixtures/v501_v530/unified_project_ok.json", "utf8"));
const project = normalizeUnifiedProject(fixture);

const exportResult = createUnifiedExportManifest(project);
assert.strictEqual(exportResult.manifest.projectId, "LOCAL-V501-001");
assert.strictEqual(exportResult.manifest.projectName, "Local Unified Baseline");
assert.strictEqual(exportResult.validation.valid, true);
assert.ok(Array.isArray(exportResult.manifest.modules));
assert.ok(Array.isArray(exportResult.manifest.documents));
assert.ok(Array.isArray(exportResult.manifest.bom));
assert.ok(Array.isArray(exportResult.manifest.files));
assert.strictEqual(exportResult.releaseGo, true);

const missingProjectName = createUnifiedExportManifest({
  ...project,
  project: { ...project.project, projectName: "" },
});
assert.strictEqual(missingProjectName.validation.valid, false);
assert.ok(missingProjectName.validation.findings.some((finding) => finding.code === "MANIFEST-REQ-001"));

const blockedQa = runUnifiedProjectQa(project, [{
  code: "BLOCK-TEST",
  severity: "BLOCKER",
  source: "TEST",
  message: "Synthetic blocker.",
  details: {},
}]);
assert.strictEqual(blockedQa.releaseGo, false);

const blockedExport = createUnifiedExportManifest({
  ...project,
  qa: { findings: blockedQa.findings, summary: blockedQa.qaSummary },
});
assert.strictEqual(blockedExport.qaSummary.releaseGo, false);

console.log("V530_UNIFIED_EXPORT_MANIFEST_TEST=PASS");
