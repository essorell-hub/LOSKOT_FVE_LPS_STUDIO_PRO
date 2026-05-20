import { normalizeUnifiedProject } from "./unifiedProjectModelV501.js";
import { validateUnifiedProject } from "./unifiedProjectValidatorV502.js";

export function detectUnifiedSourceShape(input = {}) {
  if (input.schemaVersion === "v501-v530-unified-project-model") return "unified-v501";
  if (input.export_schema || input.lps_spd_lpz || input.export_package) return "v66-v80-runtime";
  if (input.zakazka || input.objekt || input.strecha || input.dokumenty || input.databaze) return "repository-preview";
  if (input.projectInfo || input.roofs || input.exports || input.dataModelVersion) return "project-model";
  if (input.customer || input.site || input.database || input.metadata) return "project-store";
  if (input.project && (input.spd || input.grounding || input.export)) return "project-input-contract";
  return "unknown";
}

export function migrateToUnifiedProject(input = {}) {
  const sourceShape = detectUnifiedSourceShape(input);
  const project = normalizeUnifiedProject(input);
  project.project.metadata.sourceSchema = project.project.metadata.sourceSchema || sourceShape;
  const validation = validateUnifiedProject(project);

  return {
    sourceShape,
    project: validation.project,
    findings: validation.findings,
    valid: validation.valid,
  };
}

export function migrateManyToUnifiedProjects(inputs = []) {
  return (Array.isArray(inputs) ? inputs : []).map((input) => migrateToUnifiedProject(input));
}
