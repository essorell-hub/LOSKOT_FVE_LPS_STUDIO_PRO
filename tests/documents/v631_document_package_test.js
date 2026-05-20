import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createDocumentPackageV637 } from "../../src/documents/documentPackageModelV637.js";

const project = JSON.parse(
  readFileSync(new URL("../fixtures/v631_v760/project_docs_export_ok.json", import.meta.url), "utf8"),
);

const documentPackage = createDocumentPackageV637(project);

assert.equal(documentPackage.modelVersion, "V637");
assert.equal(documentPackage.projectId, "LOS-V631-OK");
assert.equal(documentPackage.documentCount, 5);
assert.deepEqual(
  documentPackage.documents.map((document) => document.documentType),
  [
    "projectTechnicalReport",
    "fveTechnicalReport",
    "lpsSpdTechnicalReport",
    "groundingBondingProtocol",
    "qaFindingsReport",
  ],
);
assert.ok(documentPackage.documents.every((document) => Array.isArray(document.sections)));

console.log("V631_DOCUMENT_PACKAGE_TEST=PASS");
