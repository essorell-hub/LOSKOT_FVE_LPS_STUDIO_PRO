import { createQaFinding, runQaFeed } from "../validation/qaFeedEngine.js";
import { REQUIRED_PROJECT_FIELDS, UNIFIED_SECTIONS } from "./unifiedProjectSchemaV501.js";
import { normalizeUnifiedProject } from "./unifiedProjectModelV501.js";

function requireArray(project, path, value, findings) {
  if (!Array.isArray(value)) {
    findings.push(createQaFinding("V502-TYPE-ARRAY", "ERROR", `Expected array at ${path}.`, { source: "UNIFIED_PROJECT_VALIDATOR", path }));
  }
}

export function validateUnifiedProject(input = {}) {
  const project = normalizeUnifiedProject(input);
  const findings = [];

  UNIFIED_SECTIONS.forEach((section) => {
    if (!(section in project)) {
      findings.push(createQaFinding("V502-SECTION-MISSING", "ERROR", `Missing unified section: ${section}.`, { source: "UNIFIED_PROJECT_VALIDATOR", section }));
    }
  });

  REQUIRED_PROJECT_FIELDS.forEach((field) => {
    if (!project.project[field]) {
      findings.push(createQaFinding("V502-PROJECT-REQ", "ERROR", `Missing required project field: ${field}.`, { source: "UNIFIED_PROJECT_VALIDATOR", field }));
    }
  });

  requireArray(project, "fve.modules", project.fve.modules, findings);
  requireArray(project, "fve.inverters", project.fve.inverters, findings);
  requireArray(project, "fve.mppts", project.fve.mppts, findings);
  requireArray(project, "fve.strings", project.fve.strings, findings);
  requireArray(project, "fve.dcRoutes", project.fve.dcRoutes, findings);
  requireArray(project, "cad.layers", project.cad.layers, findings);
  requireArray(project, "cad.objects", project.cad.objects, findings);
  requireArray(project, "lps.objects", project.lps.objects, findings);
  requireArray(project, "spd.devices", project.spd.devices, findings);
  requireArray(project, "spd.lpz", project.spd.lpz, findings);
  requireArray(project, "documents", project.documents, findings);
  requireArray(project, "bom", project.bom, findings);

  if (project.lps.riskAssessment?.normative === true) {
    findings.push(createQaFinding("V502-LPS-RISK-PLACEHOLDER", "BLOCKER", "LPS risk placeholder must not be marked as final normative calculation.", { source: "UNIFIED_PROJECT_VALIDATOR" }));
  }

  const guarded = runQaFeed({ project });
  findings.push(...guarded.qaFindings);

  return {
    valid: findings.every((finding) => finding.severity !== "ERROR" && finding.severity !== "BLOCKER"),
    project,
    findings,
    qaSummary: runQaFeed({ findings }).qaSummary,
  };
}
