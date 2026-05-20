import { evaluateExportReadinessGateV664 } from "./exportReadinessGateV664.js";

export function createExportHandoffReportV665(exportPackage = {}) {
  const readiness = evaluateExportReadinessGateV664(exportPackage);
  return {
    modelVersion: "V665",
    projectId: exportPackage.projectId || "",
    projectName: exportPackage.projectName || "",
    generatedAt: exportPackage.generatedAt || "UNSET_GENERATED_AT",
    readyForHandoff: readiness.ready,
    readiness,
    documentCount: exportPackage.documents?.documentCount || 0,
    bomItemCount: exportPackage.bom?.summary?.itemCount || 0,
    qaSummary: exportPackage.qaSummary || null,
  };
}
