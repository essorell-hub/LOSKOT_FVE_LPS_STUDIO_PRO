import { asArray, collectProjectQaFindings, createDocumentTemplateV631 } from "./documentTemplateModelV631.js";

export function getFveModel(project = {}) {
  return project.fve || project.pv || {};
}

export function createFveTechnicalReportV633(project = {}) {
  const fve = getFveModel(project);
  return createDocumentTemplateV631({
    project,
    documentType: "fveTechnicalReport",
    title: "FVE technical report",
    qaFindings: [...collectProjectQaFindings(project), ...asArray(fve.qaFindings)],
    sections: [
      {
        id: "fve-summary",
        title: "FVE summary",
        data: {
          panels: asArray(fve.panels).length,
          strings: asArray(fve.strings).length,
          dcRoutes: asArray(fve.dcRoutes).length,
          inverters: asArray(fve.inverters).length,
          nominalPowerKwp: fve.nominalPowerKwp ?? fve.powerKwp ?? null,
        },
      },
      { id: "panels", title: "Panels", data: asArray(fve.panels) },
      { id: "strings", title: "Strings", data: asArray(fve.strings) },
      { id: "dc-routes", title: "DC routes", data: asArray(fve.dcRoutes) },
      { id: "inverters", title: "Inverters", data: asArray(fve.inverters) },
    ],
  });
}
