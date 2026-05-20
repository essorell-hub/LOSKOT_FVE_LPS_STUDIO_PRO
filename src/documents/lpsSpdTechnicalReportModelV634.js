import { asArray, collectProjectQaFindings, createDocumentTemplateV631 } from "./documentTemplateModelV631.js";

export function createLpsSpdTechnicalReportV634(project = {}) {
  const lps = project.lps || {};
  const spd = project.spd || {};
  return createDocumentTemplateV631({
    project,
    documentType: "lpsSpdTechnicalReport",
    title: "LPS SPD technical report",
    qaFindings: [...collectProjectQaFindings(project), ...asArray(lps.qaFindings), ...asArray(spd.qaFindings)],
    sections: [
      {
        id: "lps-summary",
        title: "LPS summary",
        data: {
          protectionClass: lps.protectionClass || lps.lpl || "",
          airTerminals: asArray(lps.airTerminals).length,
          downConductors: asArray(lps.downConductors).length,
          riskAssessment: lps.riskAssessment || null,
        },
      },
      {
        id: "spd-summary",
        title: "SPD summary",
        data: {
          devices: asArray(spd.devices).length,
          zones: asArray(spd.zones).length,
        },
      },
      { id: "lps-elements", title: "LPS elements", data: asArray(lps.elements) },
      { id: "spd-devices", title: "SPD devices", data: asArray(spd.devices) },
    ],
  });
}
