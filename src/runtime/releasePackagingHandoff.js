import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";



export const RELEASE_PACKAGING_HANDOFF_VERSION = "v64-release-packaging-handoff";

const MODULE_NAME = "releasePackagingHandoff";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: RELEASE_PACKAGING_HANDOFF_VERSION,
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

const RELEASE_STAGES = ["DEV", "INTERNAL_PREVIEW", "FULL_PREVIEW", "RELEASE_CANDIDATE", "WINDOWS_HANDOFF"];

export function createReleasePackagingHandoff(options = {}) {
  function listReleaseStages() {
    return createResult("listReleaseStages", RELEASE_STAGES);
  }

  function buildReleaseChecklist(project = {}, releaseOptions = {}) {
    const stage = normalizeString(releaseOptions.stage, "INTERNAL_PREVIEW");
    const items = [
      { key: "verify_passed", label: "Verify prošel", required: true },
      { key: "diffcheck_passed", label: "Git diff check prošel", required: true },
      { key: "qa_passed", label: "QA bez blockerů", required: true },
      { key: "docs_generated", label: "Dokumentace vygenerována", required: stage !== "DEV" },
      { key: "export_manifest", label: "Exportní manifest připraven", required: true },
      { key: "windows_build_ready", label: "Windows build připraven", required: stage === "WINDOWS_HANDOFF" },
      { key: "classic_pro_unchanged", label: "Classic PRO vzhled zachován", required: true }
    ];
    return createResult("buildReleaseChecklist", { stage, items, classicProUnchanged: true });
  }

  function validateReleaseReadiness(project = {}, releaseOptions = {}) {
    const checklist = buildReleaseChecklist(project, releaseOptions).data;
    const issues = [];
    if (project.qa?.status && ["FAIL", "BLOCKER"].includes(project.qa.status)) issues.push({ key: "release.qa", severity: "ERROR", message: "QA stav blokuje release." });
    if (!project.name && !project.projectId && !project.id) issues.push({ key: "release.project_identity", severity: "WARNING", message: "Release nemá jasnou identitu projektu." });
    const stage = checklist.stage;
    if (stage === "WINDOWS_HANDOFF" && !project.release?.windowsBuildReady) issues.push({ key: "release.windows_build", severity: "WARNING", message: "Windows build zatím není potvrzen." });
    return createResult("validateReleaseReadiness", {
      status: issues.some((item) => item.severity === "ERROR") ? "FAIL" : issues.length ? "WARNING" : "PASS",
      issues,
      checklist
    });
  }

  function buildReleaseManifest(project = {}, releaseOptions = {}) {
    const readiness = validateReleaseReadiness(project, releaseOptions);
    return createResult("buildReleaseManifest", {
      releaseId: `${normalizeString(project.projectId || project.id, "project")}-${Date.now().toString(36)}`,
      stage: readiness.data.checklist.stage,
      projectId: project.projectId || project.id || null,
      projectName: project.name || "Nový projekt",
      createdAt: nowIso(),
      readiness: readiness.data,
      artifacts: normalizeArray(releaseOptions.artifacts),
      classicProUnchanged: true
    }, readiness.warnings || [], readiness.errors || []);
  }

  function buildWindowsHandoffPlan(project = {}, releaseOptions = {}) {
    return createResult("buildWindowsHandoffPlan", {
      projectId: project.projectId || project.id || null,
      steps: [
        { key: "freeze_runtime", label: "Zmrazit runtime moduly" },
        { key: "run_full_verify", label: "Spustit plné verify" },
        { key: "run_integration_smoke", label: "Spustit integrační smoke test" },
        { key: "prepare_tauri_build", label: "Připravit Tauri build" },
        { key: "build_windows_app", label: "Vytvořit Windows aplikaci" },
        { key: "create_release_zip", label: "Vytvořit release ZIP" },
        { key: "write_handoff_notes", label: "Zapsat handoff notes" }
      ],
      classicProUnchanged: true
    });
  }

  function getReleaseSummary(project = {}, releaseOptions = {}) {
    const manifest = buildReleaseManifest(project, releaseOptions);
    return createResult("getReleaseSummary", {
      stage: manifest.data.stage,
      status: manifest.data.readiness.status,
      releaseId: manifest.data.releaseId,
      projectName: manifest.data.projectName,
      classicProUnchanged: true
    }, manifest.warnings || [], manifest.errors || []);
  }

  function run(command, payload = {}) {
    if (command === "listReleaseStages") return listReleaseStages();
    if (command === "buildReleaseChecklist") return buildReleaseChecklist(payload.project || payload, payload.options || {});
    if (command === "validateReleaseReadiness") return validateReleaseReadiness(payload.project || payload, payload.options || {});
    if (command === "buildReleaseManifest") return buildReleaseManifest(payload.project || payload, payload.options || {});
    if (command === "buildWindowsHandoffPlan") return buildWindowsHandoffPlan(payload.project || payload, payload.options || {});
    if (command === "getReleaseSummary") return getReleaseSummary(payload.project || payload, payload.options || {});
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return { version: RELEASE_PACKAGING_HANDOFF_VERSION, classicProUnchanged: true, listReleaseStages, buildReleaseChecklist, validateReleaseReadiness, buildReleaseManifest, buildWindowsHandoffPlan, getReleaseSummary, run };
}

export function safeReleasePackagingHandoff(options = {}) {
  try { return createReleasePackagingHandoff(options); } catch (error) {
    return { version: RELEASE_PACKAGING_HANDOFF_VERSION, classicProUnchanged: true, run() { return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" }); } };
  }
}

export default { RELEASE_PACKAGING_HANDOFF_VERSION, createReleasePackagingHandoff, safeReleasePackagingHandoff };

