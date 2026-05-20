import { createQaFinding, runQaFeed, summarizeQaFindings } from "../validation/qaFeedEngine.js";
import { validateUnifiedProject } from "./unifiedProjectValidatorV502.js";
import { validateUnifiedProjectRelations } from "./unifiedProjectRelationsV505.js";

export function toUnifiedQaFinding(input = {}) {
  return createQaFinding(
    input.code || "V506-QA",
    input.severity || "INFO",
    input.message || "Unified QA finding.",
    { source: input.source || "UNIFIED_PROJECT_QA_ADAPTER", ...(input.details || {}) },
  );
}

export function runUnifiedProjectQa(project = {}, extraFindings = []) {
  const validation = validateUnifiedProject(project);
  const relations = validateUnifiedProjectRelations(validation.project);
  const findings = []
    .concat(validation.findings)
    .concat(relations.findings)
    .concat(Array.isArray(extraFindings) ? extraFindings : []);
  const feed = runQaFeed({ findings, project: validation.project });

  return {
    project: validation.project,
    findings: feed.qaFindings,
    qaSummary: feed.qaSummary,
    releaseGo: feed.releaseGo,
  };
}

export function applyUnifiedQa(project = {}, extraFindings = []) {
  const result = runUnifiedProjectQa(project, extraFindings);
  return {
    ...result.project,
    qa: {
      findings: result.findings,
      summary: summarizeQaFindings(result.findings),
    },
  };
}
