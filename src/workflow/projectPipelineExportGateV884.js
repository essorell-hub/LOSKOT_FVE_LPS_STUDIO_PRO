import { evaluateExportReadiness } from "../app/exportApplicationServiceV825.js";

export function evaluateProjectPipelineExportGateV884(project = {}, context = {}) {
  const readiness = evaluateExportReadiness(project, context);
  return {
    ok: readiness.exportReady,
    data: readiness,
    warnings: readiness.exportReady ? [] : ["EXPORT_GATE_CLOSED"],
    errors: readiness.qaSummary.hasBlockers || readiness.qaSummary.hasErrors ? ["EXPORT_GATE_QA_FAILED"] : [],
    qaFindings: readiness.qaFindings
  };
}
