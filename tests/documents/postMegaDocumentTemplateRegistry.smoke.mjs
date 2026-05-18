import assert from "node:assert/strict";
import { DOCUMENT_TEMPLATE_TYPES, createDocumentTemplate, validateDocumentTemplate, createDocumentTemplateSummary } from "../../src/documents/postMegaDocumentTemplateRegistry.mjs";

assert.equal(DOCUMENT_TEMPLATE_TYPES.includes("technical_report"), true);
const tpl = createDocumentTemplate({ id: "T1", type: "qa_checklist", title: "QA", templatePath: "templates/qa.docx" });
assert.equal(validateDocumentTemplate(tpl).ok, true);
const bad = createDocumentTemplate({ id: "T2", type: "unknown" });
assert.equal(validateDocumentTemplate(bad).ok, false);
const summary = createDocumentTemplateSummary([tpl]);
assert.equal(summary.types.includes("qa_checklist"), true);
console.log("POST-MEGA V4 document template registry smoke PASS");
