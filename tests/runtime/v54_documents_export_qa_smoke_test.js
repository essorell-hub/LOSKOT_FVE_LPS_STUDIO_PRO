
import assert from "node:assert/strict";
import {
  DOCUMENTS_EXPORT_QA_VERSION,
  createDocumentsExportQa,
  safeDocumentsExportQa
} from "../../src/runtime/documentsExportQa.js";

assert.equal(DOCUMENTS_EXPORT_QA_VERSION, "v54-documents-export-qa-foundation");
const engine = createDocumentsExportQa();
assert.equal(engine.classicProUnchanged, true);

const docs = engine.listDocumentTypes();
assert.equal(docs.ok, true);
assert.ok(docs.data.some((doc) => doc.key === "fve.technical_report"));

const def = engine.getDocumentDefinition("project.cover");
assert.equal(def.ok, true);

const validation = engine.validateDocumentRequirements("fve.technical_report", { name: "Test", fve: { panels: [] } });
assert.equal(validation.ok, true);
assert.equal(validation.data.valid, false);

const context = engine.buildDocumentContext("project.cover", { id: "P1", name: "Zakázka" });
assert.equal(context.ok, true);
assert.equal(context.data.classicProUnchanged, true);

const qa = engine.runQaChecks({ name: "Zakázka", fve: { panels: [{ id: "P1" }] }, cad: { objects: [{ id: "C1" }] } });
assert.equal(qa.ok, true);
assert.ok(["WARNING", "PASS", "FAIL", "BLOCKER"].includes(qa.data.status));

const summary = engine.summarizeQaResults(qa.data);
assert.equal(summary.ok, true);

const manifest = engine.buildExportManifest({ id: "PRJ1", name: "Zakázka", fve: { panels: [] } });
assert.equal(manifest.ok, true);
assert.equal(manifest.data.classicProUnchanged, true);

const unsupported = engine.run("missing", {});
assert.equal(unsupported.ok, false);

const safe = safeDocumentsExportQa();
assert.equal(safe.listDocumentTypes().ok, true);

console.log("v54 documents export qa smoke test OK");

