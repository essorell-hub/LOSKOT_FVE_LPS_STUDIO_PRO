import { collectAllQaFindings, summarizeQa } from "../app/qaApplicationServiceV826.js";

export function evaluateProjectPipelineQaGateV883(project = {}, context = {}) {
  const qaFindings = collectAllQaFindings(project, context);
  const qaSummary = summarizeQa(qaFindings);
  return {
    ok: !qaSummary.hasBlockers && !qaSummary.hasErrors,
    data: { qaSummary },
    warnings: qaFindings.filter((finding) => finding.severity === "WARNING").map((finding) => finding.code),
    errors: qaFindings.filter((finding) => ["BLOCKER", "ERROR"].includes(finding.severity)).map((finding) => finding.code),
    qaFindings
  };
}
