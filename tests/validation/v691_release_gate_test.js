import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createProjectExportPackageV661 } from "../../src/export/projectExportPackageV661.js";
import { evaluateReleaseGateV691 } from "../../src/validation/releaseGateModelV691.js";

const okProject = JSON.parse(
  readFileSync(new URL("../fixtures/v631_v760/project_docs_export_ok.json", import.meta.url), "utf8"),
);
const errorProject = JSON.parse(
  readFileSync(new URL("../fixtures/v631_v760/project_docs_export_with_errors.json", import.meta.url), "utf8"),
);
const foreignTerm = ["Veo", "lia"].join("");
const foreignProject = { ...okProject, siteName: `Copied ${foreignTerm} marker` };

const okPackage = createProjectExportPackageV661(okProject);
const okGate = evaluateReleaseGateV691(okProject, { bom: okPackage.bom, documents: okPackage.documents });
const errorGate = evaluateReleaseGateV691(errorProject, {});
const foreignGate = evaluateReleaseGateV691(foreignProject, { bom: okPackage.bom, documents: okPackage.documents });

assert.equal(okGate.ready, true);
assert.equal(errorGate.ready, false);
assert.ok(errorGate.findings.some((finding) => finding.ruleId === "RELEASE-001"));
assert.ok(errorGate.findings.some((finding) => finding.ruleId === "RELEASE-002"));
assert.ok(errorGate.findings.some((finding) => finding.ruleId === "RELEASE-003"));
assert.ok(errorGate.findings.some((finding) => finding.ruleId === "RELEASE-007"));
assert.ok(errorGate.findings.some((finding) => finding.ruleId === "RELEASE-008"));
assert.ok(errorGate.findings.some((finding) => finding.ruleId === "RELEASE-010"));
assert.ok(foreignGate.findings.some((finding) => finding.ruleId === "RELEASE-009"));

console.log("V691_RELEASE_GATE_TEST=PASS");
