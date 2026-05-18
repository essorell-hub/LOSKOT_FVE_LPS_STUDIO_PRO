import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";



export const PROJECT_PACKAGE_BUILDER_VERSION = "v59-project-package-builder";

const MODULE_NAME = "projectPackageBuilder";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: PROJECT_PACKAGE_BUILDER_VERSION,
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

const DEFAULT_PACKAGE_TYPES = ["INTERNAL_REVIEW", "CLIENT_HANDOFF", "REVISION_SUPPORT", "CAD_EXPORT", "FULL_PROJECT_ARCHIVE"];

function projectId(project = {}) {
  return normalizeString(project.id || project.projectId, "project-preview");
}

export function createProjectPackageBuilder(options = {}) {
  function listPackageTypes() {
    return createResult("listPackageTypes", DEFAULT_PACKAGE_TYPES);
  }

  function buildPackageManifest(project = {}, packageOptions = {}) {
    const type = normalizeString(packageOptions.packageType, "INTERNAL_REVIEW");
    const id = projectId(project);
    const documents = normalizeArray(project.documents).map((doc) => ({ id: doc.id || doc.key, title: doc.title || doc.name, path: doc.path || "" }));
    const datasheets = normalizeArray(project.datasheets).map((sheet) => ({ id: sheet.id || sheet.model, path: sheet.path || "", model: sheet.model || "" }));
    const cadExports = normalizeArray(project.cad?.exports).map((item) => ({ id: item.id || item.path, path: item.path || "" }));
    return createResult("buildPackageManifest", {
      packageId: `${id}-${type.toLowerCase()}-${Date.now().toString(36)}`,
      projectId: id,
      packageType: type,
      createdAt: new Date().toISOString(),
      documents,
      datasheets,
      cadExports,
      jsonExport: packageOptions.includeJson !== false,
      qaRequired: packageOptions.qaRequired !== false,
      classicProUnchanged: true
    });
  }

  function validatePackageReadiness(project = {}, packageOptions = {}) {
    const manifest = buildPackageManifest(project, packageOptions).data;
    const issues = [];
    if (!project.name) issues.push({ key: "package.project_name", severity: "ERROR", status: "FAIL", message: "Balík nemá název projektu." });
    if (!manifest.documents.length) issues.push({ key: "package.documents", severity: "WARNING", status: "WARNING", message: "Balík neobsahuje dokumenty." });
    if (packageOptions.qaRequired !== false && project.qa?.status && ["FAIL", "BLOCKER"].includes(project.qa.status)) {
      issues.push({ key: "package.qa_status", severity: "ERROR", status: "FAIL", message: "QA stav blokuje exportní balík." });
    }
    const status = issues.some((item) => item.severity === "ERROR") ? "FAIL" : issues.length ? "WARNING" : "PASS";
    return createResult("validatePackageReadiness", { status, issues, manifest });
  }

  function buildExportPlan(project = {}, packageOptions = {}) {
    const readiness = validatePackageReadiness(project, packageOptions);
    const manifest = readiness.data.manifest;
    return createResult("buildExportPlan", {
      manifest,
      steps: [
        { key: "collect_documents", label: "Sesbírat dokumenty", count: manifest.documents.length },
        { key: "collect_datasheets", label: "Sesbírat datasheety", count: manifest.datasheets.length },
        { key: "collect_cad", label: "Sesbírat CAD exporty", count: manifest.cadExports.length },
        { key: "write_manifest", label: "Zapsat manifest", count: 1 },
        { key: "create_zip", label: "Vytvořit ZIP balík", count: 1 }
      ],
      readiness: readiness.data,
      classicProUnchanged: true
    }, readiness.warnings || [], readiness.errors || []);
  }

  function buildHandoffChecklist(project = {}, packageOptions = {}) {
    const plan = buildExportPlan(project, packageOptions);
    return createResult("buildHandoffChecklist", {
      projectId: projectId(project),
      items: [
        { key: "qa_checked", label: "QA zkontrolováno", required: true },
        { key: "documents_generated", label: "Dokumenty vygenerované", required: true },
        { key: "datasheets_attached", label: "Datasheety přiložené", required: false },
        { key: "cad_export_attached", label: "CAD export přiložený", required: false },
        { key: "manifest_created", label: "Manifest vytvořen", required: true }
      ],
      exportPlan: plan.data
    }, plan.warnings || [], plan.errors || []);
  }

  function run(command, payload = {}) {
    if (command === "listPackageTypes") return listPackageTypes();
    if (command === "buildPackageManifest") return buildPackageManifest(payload.project || payload, payload.options || {});
    if (command === "validatePackageReadiness") return validatePackageReadiness(payload.project || payload, payload.options || {});
    if (command === "buildExportPlan") return buildExportPlan(payload.project || payload, payload.options || {});
    if (command === "buildHandoffChecklist") return buildHandoffChecklist(payload.project || payload, payload.options || {});
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return { version: PROJECT_PACKAGE_BUILDER_VERSION, classicProUnchanged: true, listPackageTypes, buildPackageManifest, validatePackageReadiness, buildExportPlan, buildHandoffChecklist, run };
}

export function safeProjectPackageBuilder(options = {}) {
  try { return createProjectPackageBuilder(options); } catch (error) {
    return { version: PROJECT_PACKAGE_BUILDER_VERSION, classicProUnchanged: true, run() { return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" }); } };
  }
}

export default { PROJECT_PACKAGE_BUILDER_VERSION, createProjectPackageBuilder, safeProjectPackageBuilder };

