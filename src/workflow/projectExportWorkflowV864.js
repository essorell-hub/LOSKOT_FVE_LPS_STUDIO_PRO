import { buildTechnicalReportSet } from "../app/documentsApplicationServiceV824.js";
import { buildBom, buildExportPackage } from "../app/exportApplicationServiceV825.js";
import { collectFveBomInputs } from "../app/fveApplicationServiceV822.js";

export function runProjectExportWorkflowV864(project = {}) {
  const documents = buildTechnicalReportSet(project);
  const bom = buildBom(project, { fveBomInputs: collectFveBomInputs(project) });
  const exportPackage = buildExportPackage(project, { documents: documents.data, bom: bom.data, documentsReady: documents.ok, bomReady: bom.ok });
  return {
    ok: documents.ok && bom.ok && exportPackage.ok,
    data: { documents: documents.data, bom: bom.data, exportPackage: exportPackage.data },
    warnings: [...documents.warnings, ...bom.warnings, ...exportPackage.warnings],
    errors: [...documents.errors, ...bom.errors, ...exportPackage.errors],
    qaFindings: [...documents.qaFindings, ...bom.qaFindings, ...exportPackage.qaFindings],
    operationLog: [
      { step: "documents", ok: documents.ok },
      { step: "bom", ok: bom.ok },
      { step: "export", ok: exportPackage.ok }
    ]
  };
}
