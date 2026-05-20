import {
  collectProjectQaFindings,
  createDocumentTemplateV631,
  summarizeQaFindings,
} from "./documentTemplateModelV631.js";

export function createQaFindingsReportV636(project = {}, extraFindings = []) {
  const findings = [...collectProjectQaFindings(project), ...extraFindings];
  return createDocumentTemplateV631({
    project,
    documentType: "qaFindingsReport",
    title: "QA findings report",
    qaFindings: findings,
    sections: [
      { id: "qa-summary", title: "QA summary", data: summarizeQaFindings(findings) },
      { id: "qa-findings", title: "QA findings", data: findings },
    ],
  });
}
