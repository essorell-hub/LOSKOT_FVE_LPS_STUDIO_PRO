import { normalizeUnifiedProject } from "../data/unifiedProjectModelV501.js";
import { validateUnifiedProject } from "../data/unifiedProjectValidatorV502.js";
import { evaluateUnifiedFve } from "./unifiedFveAdapterV511.js";
import { evaluateFvePanelPlacementQa } from "./fvePanelPlacementModelV531.js";
import { evaluateFveStringGroupingQa } from "./fveStringGroupingModelV532.js";
import { evaluateFveMpptBindingQa } from "./fveInverterMpptBindingModelV533.js";
import { evaluateFveDcRouteQa } from "./fveDcRouteModelV534.js";
import { evaluateFveOptimizerQa } from "./fveOptimizerModelV535.js";
import { runQaFeed } from "../validation/qaFeedEngine.js";

export function runFvePracticalQa(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const modelValidation = validateUnifiedProject(project);
  const baseline = evaluateUnifiedFve(project);
  const findings = []
    .concat(modelValidation.findings)
    .concat(baseline.qaFindings)
    .concat(evaluateFvePanelPlacementQa(project))
    .concat(evaluateFveStringGroupingQa(project))
    .concat(evaluateFveMpptBindingQa(project))
    .concat(evaluateFveDcRouteQa(project))
    .concat(evaluateFveOptimizerQa(project));
  const feed = runQaFeed({ fveFindings: findings, project });

  return {
    qaFindings: feed.qaFindings,
    qaSummary: feed.qaSummary,
    releaseGo: feed.releaseGo,
    baseline,
  };
}

export function createFvePracticalSummary(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const qa = runFvePracticalQa(project);

  return {
    projectId: project.project.projectId,
    panelCount: project.fve.panels.length,
    stringCount: project.fve.strings.length,
    mpptCount: project.fve.mppts.length,
    dcRouteCount: project.fve.dcRoutes.length,
    optimizerCount: Array.isArray(project.fve.optimizers) ? project.fve.optimizers.length : 0,
    qaFindings: qa.qaFindings,
    qaSummary: qa.qaSummary,
    releaseGo: qa.releaseGo,
  };
}
