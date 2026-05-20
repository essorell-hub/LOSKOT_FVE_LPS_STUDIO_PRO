import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createDocumentPackageV637 } from "../../src/documents/documentPackageModelV637.js";
import { createProjectExportPackageV661 } from "../../src/export/projectExportPackageV661.js";
import { createExportHandoffReportV665 } from "../../src/export/exportHandoffReportV665.js";
import { createProjectHandoffWorkflowV721 } from "../../src/workflow/projectHandoffWorkflowV721.js";

const project = JSON.parse(
  readFileSync(new URL("../fixtures/v631_v760/project_docs_export_ok.json", import.meta.url), "utf8"),
);

const documents = createDocumentPackageV637(project);
const exportPackage = createProjectExportPackageV661(project, { documents });
const handoffReport = createExportHandoffReportV665(exportPackage);
const workflow = createProjectHandoffWorkflowV721(project, { documents });

assert.equal(documents.documentCount, 5);
assert.equal(exportPackage.readiness, true);
assert.equal(handoffReport.readyForHandoff, true);
assert.equal(workflow.releaseGate.ready, true);
assert.equal(workflow.snapshot.ready, true);
assert.ok(workflow.exportPackage.bom.summary.itemCount > 0);

console.log("V760_DOCS_BOM_EXPORT_INTEGRATION_TEST=PASS");
