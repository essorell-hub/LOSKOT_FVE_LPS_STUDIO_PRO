import { collectAllQaFindings, summarizeQa } from "./qaApplicationServiceV826.js";

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function nowStable(input) {
  return input?.timestamp || "V821_STABLE_TIMESTAMP";
}

export function createEmptyProject(seed = {}) {
  const id = seed.id || seed.projectId || "project-v821-empty";
  return {
    schemaVersion: seed.schemaVersion || "V501_UNIFIED_PROJECT_MODEL",
    projectId: id,
    name: seed.name || "Untitled LOSKOT project",
    metadata: {
      createdBy: "projectApplicationServiceV821",
      createdAt: nowStable(seed),
      sourceStage: "V821"
    },
    fve: seed.fve || {},
    lps: seed.lps || {},
    spd: seed.spd || {},
    grounding: seed.grounding || {},
    documents: seed.documents || {},
    bom: seed.bom || {},
    export: seed.export || {},
    qa: seed.qa || { findings: [] }
  };
}

export function loadProjectPayload(payload = {}) {
  const project = payload.project ? clone(payload.project) : clone(payload);
  return {
    project: {
      ...createEmptyProject(project),
      ...project,
      metadata: {
        ...createEmptyProject(project).metadata,
        ...(project.metadata || {})
      }
    },
    source: payload.source || "memory-payload",
    loadedAt: nowStable(payload)
  };
}

export function validateProject(project = {}) {
  const errors = [];
  const warnings = [];
  if (!project || typeof project !== "object") errors.push("PROJECT_NOT_OBJECT");
  if (!project.projectId && !project.id) errors.push("PROJECT_ID_MISSING");
  if (!project.schemaVersion) warnings.push("SCHEMA_VERSION_MISSING");
  if (!project.fve) warnings.push("FVE_SECTION_MISSING");
  if (!project.lps && !project.spd && !project.grounding) warnings.push("LPS_SPD_GROUNDING_SECTION_MISSING");
  const qaFindings = collectAllQaFindings(project);
  const qaSummary = summarizeQa(qaFindings);
  return {
    valid: errors.length === 0 && !qaSummary.hasBlockers,
    errors,
    warnings,
    qaFindings,
    qaSummary
  };
}

export function createProjectSnapshot(project = {}, options = {}) {
  return {
    snapshotId: options.snapshotId || `snapshot-${project.projectId || project.id || "project"}-${options.revision || 1}`,
    createdAt: nowStable(options),
    project: clone(project),
    summary: summarizeProject(project)
  };
}

export function summarizeProject(project = {}) {
  const qaFindings = collectAllQaFindings(project);
  const qaSummary = summarizeQa(qaFindings);
  return {
    projectId: project.projectId || project.id || null,
    name: project.name || project.title || null,
    schemaVersion: project.schemaVersion || null,
    hasFve: Boolean(project.fve),
    hasLps: Boolean(project.lps || project.spd || project.grounding),
    hasDocuments: Boolean(project.documents),
    hasBom: Boolean(project.bom),
    hasExport: Boolean(project.export),
    qaSummary
  };
}

export function createProjectApplicationServiceV821() {
  return {
    createEmptyProject,
    loadProjectPayload,
    validateProject,
    createProjectSnapshot,
    summarizeProject
  };
}
