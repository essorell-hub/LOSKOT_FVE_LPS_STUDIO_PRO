import { normalizeUnifiedProject } from "../data/unifiedProjectModelV501.js";
import { createUnifiedProjectSummary } from "../data/unifiedProjectSummaryV504.js";
import { runUnifiedProjectQa } from "../data/unifiedProjectQaAdapterV506.js";
import { evaluateUnifiedFve } from "../fve/unifiedFveAdapterV511.js";
import { evaluateUnifiedLpsSpd } from "../lps/unifiedLpsSpdAdapterV513.js";
import { createUnifiedExportManifest } from "../export/unifiedExportAdapterV515.js";

export function runUnifiedWorkflowPreview(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const fve = evaluateUnifiedFve(project);
  const lpsSpd = evaluateUnifiedLpsSpd(project);
  const qa = runUnifiedProjectQa(project, fve.qaFindings.concat(lpsSpd.qaFindings));
  const exportResult = createUnifiedExportManifest({ ...project, qa: { findings: qa.findings, summary: qa.qaSummary } });

  return {
    project,
    summary: createUnifiedProjectSummary({ ...project, qa: { findings: qa.findings, summary: qa.qaSummary } }),
    fve,
    lpsSpd,
    qa,
    export: exportResult,
    status: qa.releaseGo && exportResult.releaseGo ? "READY" : "BLOCKED",
    classicProUnchanged: true,
  };
}
