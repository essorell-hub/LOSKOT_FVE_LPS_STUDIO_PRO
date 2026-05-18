import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";



export const DOCUMENTS_EXPORT_QA_VERSION = "v54-documents-export-qa-foundation";

const MODULE_NAME = "documentsExportQa";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: DOCUMENTS_EXPORT_QA_VERSION,
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

const DOCUMENTS = [
  { key: "project.cover", title: "Krycí list projektu", category: "project", required: ["project.name"] },
  { key: "fve.technical_report", title: "Technická zpráva FVE", category: "fve", required: ["fve.panels"] },
  { key: "lps.technical_report", title: "Technická zpráva LPS", category: "lps", required: ["lps.objects"] },
  { key: "qa.full_report", title: "QA report", category: "qa", required: [] },
  { key: "cad.symbol_legend", title: "Legenda CAD symbolů", category: "cad", required: ["cad.objects"] }
];

const QA_RULES = [
  { key: "project.required_name", category: "project", severity: "ERROR" },
  { key: "fve.has_panels", category: "fve", severity: "WARNING" },
  { key: "cad.objects.have_symbol", category: "cad", severity: "WARNING" },
  { key: "lps.risk.placeholder_warning", category: "lps", severity: "WARNING" }
];

function hasPath(project, path) {
  const parts = path.split(".");
  let value = project;
  for (const part of parts) {
    value = value?.[part];
  }
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && value !== "";
}

function qaStatusFromIssues(issues = []) {
  if (issues.some((item) => item.severity === "BLOCKER")) return "BLOCKER";
  if (issues.some((item) => item.severity === "ERROR")) return "FAIL";
  if (issues.some((item) => item.severity === "WARNING")) return "WARNING";
  return "PASS";
}

export function createDocumentsExportQa(options = {}) {
  const documents = normalizeArray(options.documents).length ? normalizeArray(options.documents) : DOCUMENTS;
  const rules = normalizeArray(options.qaRules).length ? normalizeArray(options.qaRules) : QA_RULES;

  function listDocumentTypes() {
    return createResult("listDocumentTypes", documents);
  }

  function getDocumentDefinition(documentKey) {
    const doc = documents.find((item) => item.key === documentKey);
    if (!doc) return createResult("getDocumentDefinition", null, [`Dokument ${documentKey} nebyl nalezen.`]);
    return createResult("getDocumentDefinition", doc);
  }

  function validateDocumentRequirements(documentKey, project = {}) {
    const def = getDocumentDefinition(documentKey);
    if (!def.ok || !def.data) return def;
    const missing = normalizeArray(def.data.required).filter((path) => !hasPath(project, path));
    return createResult("validateDocumentRequirements", {
      documentKey,
      valid: missing.length === 0,
      missing
    }, missing.length ? [`Chybí požadavky dokumentu: ${missing.join(", ")}`] : []);
  }

  function buildDocumentContext(documentKey, project = {}) {
    const validation = validateDocumentRequirements(documentKey, project);
    return createResult("buildDocumentContext", {
      documentKey,
      projectId: project.id || project.projectId || null,
      projectName: project.name || "Nový projekt",
      validation: validation.data,
      generatedAt: new Date().toISOString(),
      classicProUnchanged: true
    }, validation.warnings || [], validation.errors || []);
  }

  function listQaRules() {
    return createResult("listQaRules", rules);
  }

  function runQaChecks(project = {}) {
    const issues = [];
    if (!project.name) issues.push({ key: "project.required_name", category: "project", severity: "ERROR", status: "FAIL", message: "Chybí název projektu." });
    if (!normalizeArray(project.fve?.panels).length) issues.push({ key: "fve.has_panels", category: "fve", severity: "WARNING", status: "WARNING", message: "Projekt nemá FVE panely." });
    normalizeArray(project.cad?.objects).forEach((object) => {
      if (!object.symbolKey && !object.symbolId) {
        issues.push({ key: "cad.objects.have_symbol", category: "cad", severity: "WARNING", status: "WARNING", message: `CAD objekt ${object.id || "unknown"} nemá symbol.` });
      }
    });
    issues.push({ key: "lps.risk.placeholder_warning", category: "lps", severity: "WARNING", status: "WARNING", message: "LPS risk assessment je placeholder, ne finální normový výpočet." });
    return createResult("runQaChecks", { status: qaStatusFromIssues(issues), issues, rulesChecked: rules.length });
  }

  function summarizeQaResults(results = {}) {
    const issues = normalizeArray(results.issues || results.data?.issues);
    return createResult("summarizeQaResults", {
      status: qaStatusFromIssues(issues),
      total: issues.length,
      warnings: issues.filter((item) => item.severity === "WARNING").length,
      errors: issues.filter((item) => item.severity === "ERROR").length,
      blockers: issues.filter((item) => item.severity === "BLOCKER").length
    });
  }

  function getBlockingIssues(results = {}) {
    const issues = normalizeArray(results.issues || results.data?.issues);
    return createResult("getBlockingIssues", issues.filter((item) => item.severity === "BLOCKER" || item.severity === "ERROR"));
  }

  function buildExportManifest(project = {}, options = {}) {
    const qa = runQaChecks(project);
    return createResult("buildExportManifest", {
      projectId: project.id || project.projectId || null,
      packageType: options.packageType || "INTERNAL_REVIEW",
      documents: documents.map((doc) => doc.key),
      datasheets: normalizeArray(project.datasheets),
      qaSummary: summarizeQaResults(qa.data).data,
      createdAt: new Date().toISOString(),
      classicProUnchanged: true
    }, qa.warnings || []);
  }

  function run(command, payload = {}) {
    if (command === "listDocumentTypes") return listDocumentTypes();
    if (command === "getDocumentDefinition") return getDocumentDefinition(payload.documentKey || payload.key);
    if (command === "validateDocumentRequirements") return validateDocumentRequirements(payload.documentKey, payload.project || payload);
    if (command === "buildDocumentContext") return buildDocumentContext(payload.documentKey, payload.project || payload);
    if (command === "listQaRules") return listQaRules();
    if (command === "runQaChecks") return runQaChecks(payload.project || payload);
    if (command === "summarizeQaResults") return summarizeQaResults(payload.results || payload);
    if (command === "getBlockingIssues") return getBlockingIssues(payload.results || payload);
    if (command === "buildExportManifest") return buildExportManifest(payload.project || payload, payload.options || {});
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return {
    version: DOCUMENTS_EXPORT_QA_VERSION,
    classicProUnchanged: true,
    listDocumentTypes,
    getDocumentDefinition,
    validateDocumentRequirements,
    buildDocumentContext,
    listQaRules,
    runQaChecks,
    summarizeQaResults,
    getBlockingIssues,
    buildExportManifest,
    run
  };
}

export function safeDocumentsExportQa(options = {}) {
  try {
    return createDocumentsExportQa(options);
  } catch (error) {
    return {
      version: DOCUMENTS_EXPORT_QA_VERSION,
      classicProUnchanged: true,
      run() {
        return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" });
      }
    };
  }
}

export default {
  DOCUMENTS_EXPORT_QA_VERSION,
  createDocumentsExportQa,
  safeDocumentsExportQa
};

