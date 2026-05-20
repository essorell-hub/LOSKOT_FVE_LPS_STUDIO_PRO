import assert from "node:assert";
import { readFileSync } from "node:fs";

import { UNIFIED_PROJECT_SCHEMA_VERSION, createUnifiedDefaults } from "../../src/data/unifiedProjectSchemaV501.js";
import { createDefaultUnifiedProject, normalizeUnifiedProject, getUnifiedProjectSection } from "../../src/data/unifiedProjectModelV501.js";
import { validateUnifiedProject } from "../../src/data/unifiedProjectValidatorV502.js";
import { detectUnifiedSourceShape, migrateToUnifiedProject } from "../../src/data/unifiedProjectMigratorV503.js";
import { createUnifiedProjectSummary } from "../../src/data/unifiedProjectSummaryV504.js";
import { validateUnifiedProjectRelations } from "../../src/data/unifiedProjectRelationsV505.js";
import { runUnifiedProjectQa } from "../../src/data/unifiedProjectQaAdapterV506.js";

const fixture = JSON.parse(readFileSync("tests/fixtures/v501_v530/unified_project_ok.json", "utf8"));
const legacy = JSON.parse(readFileSync("tests/fixtures/v501_v530/unified_project_legacy_v66.json", "utf8"));

const defaults = createUnifiedDefaults("2026-01-01T00:00:00.000Z");
assert.strictEqual(defaults.schemaVersion, UNIFIED_PROJECT_SCHEMA_VERSION);
assert.deepStrictEqual(defaults.fve.modules, []);
assert.deepStrictEqual(defaults.spd.devices, []);

const project = normalizeUnifiedProject(fixture);
assert.strictEqual(project.project.projectId, "LOCAL-V501-001");
assert.strictEqual(project.project.projectName, "Local Unified Baseline");
assert.strictEqual(project.fve.modules.length, 1);
assert.strictEqual(project.fve.dcRoutes.length, 1);
assert.strictEqual(project.cad.objects.length, 1);
assert.strictEqual(project.lps.riskAssessment.placeholder, true);
assert.strictEqual(project.lps.riskAssessment.normative, false);

const created = createDefaultUnifiedProject({ project: { projectId: "P2", projectName: "Second" } });
assert.strictEqual(created.project.projectId, "P2");
assert.strictEqual(getUnifiedProjectSection(created, "fve").strings.length, 0);
assert.deepStrictEqual(getUnifiedProjectSection(null, "fve", { ok: true }), { ok: true });

const validation = validateUnifiedProject(project);
assert.strictEqual(validation.valid, true);
assert.strictEqual(validation.findings.length, 0);

const invalid = validateUnifiedProject({ project: { projectId: "", projectName: "" } });
assert.strictEqual(invalid.valid, false);
assert.ok(invalid.findings.some((finding) => finding.code === "V502-PROJECT-REQ"));

assert.strictEqual(detectUnifiedSourceShape(legacy), "v66-v80-runtime");
const migrated = migrateToUnifiedProject(legacy);
assert.strictEqual(migrated.project.project.projectId, "LEGACY-001");
assert.strictEqual(migrated.project.project.projectName, "Legacy Local Baseline");

const summary = createUnifiedProjectSummary(project);
assert.strictEqual(summary.counts.modules, 1);
assert.strictEqual(summary.counts.spdDevices, 2);
assert.strictEqual(summary.lpsRiskPlaceholder, true);

const relations = validateUnifiedProjectRelations(project);
assert.strictEqual(relations.valid, true);

const badRelations = validateUnifiedProjectRelations({
  ...project,
  fve: { ...project.fve, strings: [{ stringId: "bad", moduleId: "missing", mpptId: "mppt-1", moduleCount: 1 }] },
});
assert.strictEqual(badRelations.valid, false);
assert.ok(badRelations.findings.some((finding) => finding.code === "V505-FVE-MODULE-REF"));

const qa = runUnifiedProjectQa(project);
assert.strictEqual(qa.releaseGo, true);
assert.strictEqual(qa.qaSummary.bySeverity.ERROR, 0);

console.log("V501_UNIFIED_PROJECT_MODEL_TEST=PASS");
