import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";



export const PDF_DOCX_REPORT_GENERATOR_VERSION = "v60-pdf-docx-report-generator";

const MODULE_NAME = "pdfDocxReportGenerator";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: PDF_DOCX_REPORT_GENERATOR_VERSION,
      classicProUnchanged: true
    }
  });
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

const DEFAULT_TEMPLATES = [
  { key: "project.cover", title: "Krycí list projektu", formats: ["docx", "pdf"] },
  { key: "fve.technical_report", title: "Technická zpráva FVE", formats: ["docx", "pdf"] },
  { key: "lps.technical_report", title: "Technická zpráva LPS", formats: ["docx", "pdf"] },
  { key: "qa.full_report", title: "QA report", formats: ["docx", "pdf"] },
  { key: "export.manifest", title: "Exportní manifest", formats: ["json", "pdf"] }
];

function sanitizeFilename(value = "") {
  return String(value || "document").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "") || "document";
}

export function createPdfDocxReportGenerator(options = {}) {
  const templates = normalizeArray(options.templates).length ? normalizeArray(options.templates) : DEFAULT_TEMPLATES;

  function listTemplates() {
    return createResult("listTemplates", templates);
  }

  function buildReportContext(documentKey, project = {}, extra = {}) {
    const template = templates.find((item) => item.key === documentKey);
    if (!template) return createResult("buildReportContext", null, [], [{ message: `Template ${documentKey} nebyl nalezen.` }]);
    return createResult("buildReportContext", {
      documentKey,
      template,
      projectId: project.id || project.projectId || null,
      projectName: project.name || "Nový projekt",
      customer: project.customer || {},
      site: project.site || {},
      fve: project.fve || {},
      lps: project.lps || {},
      qa: project.qa || {},
      extra,
      generatedAt: new Date().toISOString(),
      classicProUnchanged: true
    });
  }

  function buildDocxJob(documentKey, project = {}, extra = {}) {
    const context = buildReportContext(documentKey, project, extra);
    if (!context.ok) return context;
    const filename = `${sanitizeFilename(context.data.projectName)}_${sanitizeFilename(documentKey)}.docx`;
    return createResult("buildDocxJob", { format: "docx", filename, context: context.data, engine: "planned-docx-generator" });
  }

  function buildPdfJob(documentKey, project = {}, extra = {}) {
    const context = buildReportContext(documentKey, project, extra);
    if (!context.ok) return context;
    const filename = `${sanitizeFilename(context.data.projectName)}_${sanitizeFilename(documentKey)}.pdf`;
    return createResult("buildPdfJob", { format: "pdf", filename, context: context.data, engine: "planned-pdf-generator" });
  }

  function buildGenerationPlan(project = {}, options = {}) {
    const requested = normalizeArray(options.documentKeys).length ? normalizeArray(options.documentKeys) : templates.map((item) => item.key);
    const formats = normalizeArray(options.formats).length ? normalizeArray(options.formats) : ["docx", "pdf"];
    const jobs = [];
    const warnings = [];
    requested.forEach((key) => {
      const template = templates.find((item) => item.key === key);
      if (!template) {
        warnings.push(`Template ${key} nebyl nalezen.`);
        return;
      }
      formats.forEach((format) => {
        if (!template.formats.includes(format)) {
          warnings.push(`Template ${key} nepodporuje formát ${format}.`);
          return;
        }
        jobs.push({ documentKey: key, format, filename: `${sanitizeFilename(project.name || "projekt")}_${sanitizeFilename(key)}.${format}` });
      });
    });
    return createResult("buildGenerationPlan", { jobs, count: jobs.length, classicProUnchanged: true }, warnings);
  }

  function validateGenerationReadiness(project = {}, options = {}) {
    const issues = [];
    if (!project.name) issues.push({ key: "report.project_name", severity: "WARNING", status: "WARNING", message: "Chybí název projektu pro názvy souborů." });
    const plan = buildGenerationPlan(project, options);
    if (!plan.data.jobs.length) issues.push({ key: "report.jobs", severity: "ERROR", status: "FAIL", message: "Nejsou žádné report jobs." });
    const status = issues.some((item) => item.severity === "ERROR") ? "FAIL" : issues.length ? "WARNING" : "PASS";
    return createResult("validateGenerationReadiness", { status, issues, plan: plan.data }, plan.warnings || []);
  }

  function run(command, payload = {}) {
    if (command === "listTemplates") return listTemplates();
    if (command === "buildReportContext") return buildReportContext(payload.documentKey, payload.project || payload, payload.extra || {});
    if (command === "buildDocxJob") return buildDocxJob(payload.documentKey, payload.project || payload, payload.extra || {});
    if (command === "buildPdfJob") return buildPdfJob(payload.documentKey, payload.project || payload, payload.extra || {});
    if (command === "buildGenerationPlan") return buildGenerationPlan(payload.project || payload, payload.options || {});
    if (command === "validateGenerationReadiness") return validateGenerationReadiness(payload.project || payload, payload.options || {});
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return { version: PDF_DOCX_REPORT_GENERATOR_VERSION, classicProUnchanged: true, listTemplates, buildReportContext, buildDocxJob, buildPdfJob, buildGenerationPlan, validateGenerationReadiness, run };
}

export function safePdfDocxReportGenerator(options = {}) {
  try { return createPdfDocxReportGenerator(options); } catch (error) {
    return { version: PDF_DOCX_REPORT_GENERATOR_VERSION, classicProUnchanged: true, run() { return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" }); } };
  }
}

export default { PDF_DOCX_REPORT_GENERATOR_VERSION, createPdfDocxReportGenerator, safePdfDocxReportGenerator };

