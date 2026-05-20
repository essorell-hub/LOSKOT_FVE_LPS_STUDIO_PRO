import { normalizeLpsObject } from "./lpsObjectModel.js";
import { createRiskAssessmentPlaceholder } from "./riskAssessmentPlaceholder.js";
import { evaluateSpdCoordination } from "./spdCoordinationModel.js";
import { normalizeUnifiedProject } from "../data/unifiedProjectModelV501.js";
import { runQaFeed } from "../validation/qaFeedEngine.js";

export function evaluateUnifiedLpsSpd(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const lpsObjects = project.lps.objects.map((object) => normalizeLpsObject(object, false)).filter(Boolean);
  const riskAssessment = createRiskAssessmentPlaceholder({
    ...project.lps.riskAssessment,
    normative: false,
  });
  const spd = evaluateSpdCoordination({
    spdDevices: project.spd.devices,
    lpZones: project.spd.lpz,
    routes: project.fve.dcRoutes,
    grounding: project.grounding,
    bonding: project.bonding,
  });
  const placeholderFinding = {
    code: "V513-LPS-RISK-PLACEHOLDER",
    severity: "WARN",
    source: "UNIFIED_LPS_SPD_ADAPTER",
    message: "LPS risk assessment is a placeholder and not a final normative calculation.",
    details: { placeholder: true, normative: false },
  };
  const feed = runQaFeed({ spdFindings: spd.qaFindings, lpsFindings: [placeholderFinding], project });

  return {
    lpsObjects,
    riskAssessment: {
      ...riskAssessment,
      placeholder: true,
      normative: false,
    },
    spd,
    qaFindings: feed.qaFindings,
    qaSummary: feed.qaSummary,
    releaseGo: feed.releaseGo,
  };
}
