import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";



export const USER_WORKFLOW_AUTOMATION_VERSION = "v62-user-workflow-automation";

const MODULE_NAME = "userWorkflowAutomation";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: USER_WORKFLOW_AUTOMATION_VERSION,
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

const WORKFLOW_STEPS = [
  "create_project",
  "set_site",
  "define_roof",
  "place_fve_panels",
  "create_strings",
  "define_lps",
  "run_calculations",
  "run_qa",
  "generate_documents",
  "build_export_package"
];

export function createUserWorkflowAutomation(options = {}) {
  function listWorkflowSteps() {
    return createResult("listWorkflowSteps", WORKFLOW_STEPS.map((key, index) => ({ key, order: index + 1 })));
  }

  function getProjectProgress(project = {}) {
    const done = new Set();
    if (project.id || project.projectId || project.name) done.add("create_project");
    if (project.site?.address || project.site?.gps) done.add("set_site");
    if (project.roof?.planes?.length || project.roofPlanes?.length) done.add("define_roof");
    if (project.fve?.panels?.length) done.add("place_fve_panels");
    if (project.fve?.strings?.length) done.add("create_strings");
    if (project.lps?.objects?.length || project.lps?.components?.length) done.add("define_lps");
    if (project.calculations || project.fve?.calculationSummary) done.add("run_calculations");
    if (project.qa?.status) done.add("run_qa");
    if (project.documents?.length) done.add("generate_documents");
    if (project.export?.packages?.length || project.packageManifest) done.add("build_export_package");

    const steps = WORKFLOW_STEPS.map((key, index) => ({ key, order: index + 1, done: done.has(key) }));
    return createResult("getProjectProgress", {
      total: steps.length,
      done: steps.filter((step) => step.done).length,
      percent: Math.round((steps.filter((step) => step.done).length / steps.length) * 100),
      steps,
      classicProUnchanged: true
    });
  }

  function getNextRecommendedAction(project = {}) {
    const progress = getProjectProgress(project).data;
    const next = progress.steps.find((step) => !step.done) || null;
    return createResult("getNextRecommendedAction", {
      next,
      completed: !next,
      message: next ? `Další krok: ${next.key}` : "Workflow je kompletní."
    });
  }

  function buildCommandQueue(project = {}) {
    const next = getNextRecommendedAction(project).data.next;
    const commands = next ? [{ command: next.key, status: "PENDING", safe: true }] : [];
    return createResult("buildCommandQueue", { commands, classicProUnchanged: true });
  }

  function applyWorkflowEvent(project = {}, event = {}) {
    const events = [...normalizeArray(project.workflowEvents), { ...event, appliedAt: nowIso() }];
    return createResult("applyWorkflowEvent", {
      project: {
        ...project,
        workflowEvents: events,
        metadata: { ...(project.metadata || {}), updatedAt: nowIso() }
      },
      eventAccepted: true,
      classicProUnchanged: true
    });
  }

  function buildOperatorChecklist(project = {}) {
    const progress = getProjectProgress(project).data;
    return createResult("buildOperatorChecklist", {
      items: progress.steps.map((step) => ({
        key: step.key,
        label: step.key.replaceAll("_", " "),
        required: true,
        done: step.done
      })),
      percent: progress.percent
    });
  }

  function run(command, payload = {}) {
    if (command === "listWorkflowSteps") return listWorkflowSteps();
    if (command === "getProjectProgress") return getProjectProgress(payload.project || payload);
    if (command === "getNextRecommendedAction") return getNextRecommendedAction(payload.project || payload);
    if (command === "buildCommandQueue") return buildCommandQueue(payload.project || payload);
    if (command === "applyWorkflowEvent") return applyWorkflowEvent(payload.project || payload, payload.event || {});
    if (command === "buildOperatorChecklist") return buildOperatorChecklist(payload.project || payload);
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return { version: USER_WORKFLOW_AUTOMATION_VERSION, classicProUnchanged: true, listWorkflowSteps, getProjectProgress, getNextRecommendedAction, buildCommandQueue, applyWorkflowEvent, buildOperatorChecklist, run };
}

export function safeUserWorkflowAutomation(options = {}) {
  try { return createUserWorkflowAutomation(options); } catch (error) {
    return { version: USER_WORKFLOW_AUTOMATION_VERSION, classicProUnchanged: true, run() { return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" }); } };
  }
}

export default { USER_WORKFLOW_AUTOMATION_VERSION, createUserWorkflowAutomation, safeUserWorkflowAutomation };

