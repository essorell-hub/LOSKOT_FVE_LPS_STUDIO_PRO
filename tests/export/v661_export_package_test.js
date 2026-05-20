import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createProjectExportPackageV661 } from "../../src/export/projectExportPackageV661.js";
import { evaluateExportReadinessGateV664 } from "../../src/export/exportReadinessGateV664.js";

const okProject = JSON.parse(
  readFileSync(new URL("../fixtures/v631_v760/project_docs_export_ok.json", import.meta.url), "utf8"),
);
const errorProject = JSON.parse(
  readFileSync(new URL("../fixtures/v631_v760/project_docs_export_with_errors.json", import.meta.url), "utf8"),
);

const okPackage = createProjectExportPackageV661(okProject);
const errorPackage = createProjectExportPackageV661(errorProject);
const errorReadiness = evaluateExportReadinessGateV664(errorPackage);

assert.equal(okPackage.modelVersion, "V661");
assert.equal(okPackage.readiness, true);
assert.ok(okPackage.documents.documentCount >= 5);
assert.ok(okPackage.bom.summary.itemCount > 0);
assert.equal(errorPackage.readiness, false);
assert.equal(errorReadiness.ready, false);
assert.ok(errorReadiness.blockers.length > 0 || errorReadiness.missing.length > 0);

console.log("V661_EXPORT_PACKAGE_TEST=PASS");
