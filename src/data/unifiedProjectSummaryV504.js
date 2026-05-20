import { normalizeUnifiedProject } from "./unifiedProjectModelV501.js";

export function createUnifiedProjectSummary(input = {}) {
  const project = normalizeUnifiedProject(input);

  return {
    projectId: project.project.projectId,
    projectName: project.project.projectName,
    schemaVersion: project.schemaVersion,
    appVersion: project.appVersion,
    counts: {
      modules: project.fve.modules.length,
      inverters: project.fve.inverters.length,
      mppts: project.fve.mppts.length,
      strings: project.fve.strings.length,
      dcRoutes: project.fve.dcRoutes.length,
      cadLayers: project.cad.layers.length,
      cadObjects: project.cad.objects.length,
      lpsObjects: project.lps.objects.length,
      downConductors: project.lps.downConductors.length,
      airTermination: project.lps.airTermination.length,
      spdDevices: project.spd.devices.length,
      lpz: project.spd.lpz.length,
      documents: project.documents.length,
      bom: project.bom.length,
      qaFindings: project.qa.findings.length,
    },
    releaseGo: project.qa.summary?.releaseGo !== false,
    lpsRiskPlaceholder: project.lps.riskAssessment?.placeholder === true,
  };
}
