
import assert from "node:assert/strict";
import { PDF_DOCX_REPORT_GENERATOR_VERSION, createPdfDocxReportGenerator, safePdfDocxReportGenerator } from "../../src/runtime/pdfDocxReportGenerator.js";

assert.equal(PDF_DOCX_REPORT_GENERATOR_VERSION, "v60-pdf-docx-report-generator");
const generator = createPdfDocxReportGenerator();

const templates = generator.listTemplates();
assert.equal(templates.ok, true);
assert.ok(templates.data.length >= 4);

const project = { id: "PRJ1", name: "Zakázka Brno", fve: { panels: [] }, qa: { status: "PASS" } };
const context = generator.buildReportContext("project.cover", project);
assert.equal(context.ok, true);
assert.equal(context.data.classicProUnchanged, true);

const docx = generator.buildDocxJob("project.cover", project);
assert.equal(docx.ok, true);
assert.match(docx.data.filename, /project.cover\.docx$/);

const pdf = generator.buildPdfJob("qa.full_report", project);
assert.equal(pdf.ok, true);
assert.match(pdf.data.filename, /qa.full_report\.pdf$/);

const plan = generator.buildGenerationPlan(project, { documentKeys: ["project.cover"], formats: ["docx", "pdf"] });
assert.equal(plan.ok, true);
assert.equal(plan.data.count, 2);

assert.equal(generator.validateGenerationReadiness(project, {}).ok, true);
assert.equal(generator.run("missing", {}).ok, false);
assert.equal(safePdfDocxReportGenerator().run("listTemplates").ok, true);

console.log("v60 pdf docx report generator smoke test OK");

