import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createEmptyProject, validateProject, createProjectSnapshot, summarizeProject } from "../../src/app/projectApplicationServiceV821.js";
import { evaluateFvePractical, collectFveBomInputs } from "../../src/app/fveApplicationServiceV822.js";
import { evaluateLpsSpdGrounding } from "../../src/app/lpsSpdApplicationServiceV823.js";
import { buildTechnicalReportSet } from "../../src/app/documentsApplicationServiceV824.js";
import { buildBom, buildExportPackage } from "../../src/app/exportApplicationServiceV825.js";
import { collectAllQaFindings, evaluateReleaseGate } from "../../src/app/qaApplicationServiceV826.js";

const okProject = JSON.parse(readFileSync(new URL("../fixtures/v821_v920/orchestration_project_ok.json", import.meta.url), "utf8"));
const errorProject = JSON.parse(readFileSync(new URL("../fixtures/v821_v920/orchestration_project_with_errors.json", import.meta.url), "utf8"));

const empty = createEmptyProject({ projectId: "service-empty" });
assert.equal(empty.projectId, "service-empty");

const validation = validateProject(okProject);
assert.equal(validation.valid, true);

const fve = evaluateFvePractical(okProject);
assert.equal(fve.data.dcPowerWp, 9000);

const lps = evaluateLpsSpdGrounding(okProject);
assert.equal(lps.ok, true);

const bom = buildBom(okProject, { fveBomInputs: collectFveBomInputs(okProject) });
assert.equal(bom.ok, true);
assert.equal(bom.data.rows.some((row) => row.code === "FVE_PANEL"), true);

const documents = buildTechnicalReportSet(okProject, { bom: bom.data });
assert.equal(documents.ok, true);

const exportPackage = buildExportPackage(okProject, { documents: documents.data, bom: bom.data });
assert.equal(exportPackage.ok, true);

const findings = collectAllQaFindings(errorProject);
assert.equal(findings.some((finding) => finding.code === "FOREIGN_CONTENT_BLOCKER"), true);
assert.equal(findings.some((finding) => finding.code === "PLACEHOLDER_NORMATIVE_BLOCKER"), true);

const releaseGate = evaluateReleaseGate(errorProject);
assert.equal(releaseGate.releaseGo, false);
assert.equal(releaseGate.exportReady, false);

const snapshot = createProjectSnapshot(okProject, { snapshotId: "service-snapshot" });
assert.equal(snapshot.snapshotId, "service-snapshot");
assert.equal(summarizeProject(okProject).projectId, "orch-ok-001");

console.log("V821_APPLICATION_SERVICES_TEST=PASS");
