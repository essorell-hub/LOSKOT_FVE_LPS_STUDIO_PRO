import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";



export const IMPORT_EXPORT_BACKUP_ENGINE_VERSION = "v61-import-export-backup-engine";

const MODULE_NAME = "importExportBackupEngine";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: IMPORT_EXPORT_BACKUP_ENGINE_VERSION,
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

function nowIso() {
  return new Date().toISOString();
}

const EXPORT_FORMATS = ["loskot-project-json", "runtime-snapshot-json", "backup-manifest-json"];
const IMPORT_MODES = ["validate-only", "merge", "replace"];

function normalizeProject(project = {}) {
  const id = normalizeString(project.id || project.projectId, `project-${Date.now().toString(36)}`);
  return {
    ...project,
    id,
    projectId: normalizeString(project.projectId, id),
    name: normalizeString(project.name, "Nový projekt"),
    fve: project.fve || { panels: [], strings: [], inverters: [], dcRoutes: [] },
    cad: project.cad || { layers: [], objects: [] },
    lps: project.lps || { objects: [], components: [], spdDevices: [] },
    documents: normalizeArray(project.documents),
    metadata: {
      ...(project.metadata || {}),
      exportRuntimeVersion: IMPORT_EXPORT_BACKUP_ENGINE_VERSION,
      updatedAt: nowIso()
    }
  };
}

export function createImportExportBackupEngine(options = {}) {
  function listFormats() {
    return createResult("listFormats", { exportFormats: EXPORT_FORMATS, importModes: IMPORT_MODES });
  }

  function exportProject(project = {}, exportOptions = {}) {
    const normalized = normalizeProject(project);
    const format = normalizeString(exportOptions.format, "loskot-project-json");
    if (!EXPORT_FORMATS.includes(format)) {
      return createResult("exportProject", null, [], [{ message: `Unsupported export format: ${format}` }]);
    }
    return createResult("exportProject", {
      format,
      exportedAt: nowIso(),
      project: normalized,
      manifest: {
        projectId: normalized.projectId,
        projectName: normalized.name,
        counts: {
          fvePanels: normalizeArray(normalized.fve.panels).length,
          cadObjects: normalizeArray(normalized.cad.objects).length,
          lpsObjects: normalizeArray(normalized.lps.objects || normalized.lps.components).length,
          documents: normalizeArray(normalized.documents).length
        },
        classicProUnchanged: true
      }
    });
  }

  function validateImportPayload(payload = {}) {
    const project = payload.project || payload;
    const issues = [];
    if (!project || typeof project !== "object") {
      issues.push({ key: "import.payload.object", severity: "ERROR", message: "Import payload není objekt." });
    }
    if (project && typeof project === "object" && !project.name && !project.projectId && !project.id) {
      issues.push({ key: "import.project.identity", severity: "WARNING", message: "Import nemá jasnou identitu projektu." });
    }
    return createResult("validateImportPayload", {
      valid: !issues.some((item) => item.severity === "ERROR"),
      issues
    });
  }

  function importProject(payload = {}, importOptions = {}) {
    const validation = validateImportPayload(payload);
    if (!validation.data.valid) {
      return createResult("importProject", null, validation.warnings || [], validation.data.issues.map((issue) => ({ message: issue.message })));
    }
    const mode = normalizeString(importOptions.mode, "validate-only");
    if (!IMPORT_MODES.includes(mode)) {
      return createResult("importProject", null, [], [{ message: `Unsupported import mode: ${mode}` }]);
    }
    return createResult("importProject", {
      mode,
      accepted: true,
      project: normalizeProject(payload.project || payload),
      validation: validation.data,
      classicProUnchanged: true
    });
  }

  function createBackupManifest(project = {}, backupOptions = {}) {
    const normalized = normalizeProject(project);
    return createResult("createBackupManifest", {
      backupId: `${normalized.projectId}-backup-${Date.now().toString(36)}`,
      projectId: normalized.projectId,
      projectName: normalized.name,
      createdAt: nowIso(),
      includeGraphics: backupOptions.includeGraphics !== false,
      includeDocuments: backupOptions.includeDocuments !== false,
      includeDatabase: backupOptions.includeDatabase !== false,
      includeLogs: backupOptions.includeLogs === true,
      classicProUnchanged: true
    });
  }

  function createRestorePlan(manifest = {}, restoreOptions = {}) {
    const steps = [
      { key: "validate_manifest", label: "Ověřit manifest" },
      { key: "restore_project_json", label: "Obnovit projektový JSON" },
      { key: "restore_database", label: "Obnovit databázová data", optional: true },
      { key: "restore_documents", label: "Obnovit dokumenty", optional: true },
      { key: "restore_graphics", label: "Obnovit grafické assety", optional: true },
      { key: "run_qa", label: "Spustit QA po obnově" }
    ];
    return createResult("createRestorePlan", { manifest, restoreOptions, steps, classicProUnchanged: true });
  }

  function run(command, payload = {}) {
    if (command === "listFormats") return listFormats();
    if (command === "exportProject") return exportProject(payload.project || payload, payload.options || {});
    if (command === "validateImportPayload") return validateImportPayload(payload.payload || payload);
    if (command === "importProject") return importProject(payload.payload || payload, payload.options || {});
    if (command === "createBackupManifest") return createBackupManifest(payload.project || payload, payload.options || {});
    if (command === "createRestorePlan") return createRestorePlan(payload.manifest || payload, payload.options || {});
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return { version: IMPORT_EXPORT_BACKUP_ENGINE_VERSION, classicProUnchanged: true, listFormats, exportProject, validateImportPayload, importProject, createBackupManifest, createRestorePlan, run };
}

export function safeImportExportBackupEngine(options = {}) {
  try { return createImportExportBackupEngine(options); } catch (error) {
    return { version: IMPORT_EXPORT_BACKUP_ENGINE_VERSION, classicProUnchanged: true, run() { return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" }); } };
  }
}

export default { IMPORT_EXPORT_BACKUP_ENGINE_VERSION, createImportExportBackupEngine, safeImportExportBackupEngine };

