import { normalizeUnifiedProject } from "../data/unifiedProjectModelV501.js";
import { createQaFinding, runQaFeed } from "../validation/qaFeedEngine.js";

export function createFveOptimizerPlaceholder(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const optimizers = Array.isArray(project.fve.optimizers) ? project.fve.optimizers : [];
  const qaFindings = evaluateFveOptimizerQa({ ...project, fve: { ...project.fve, optimizers } });
  const feed = runQaFeed({ fveFindings: qaFindings, project });

  return {
    placeholder: true,
    normative: false,
    finalDesign: false,
    optimizers,
    qaFindings: feed.qaFindings,
    qaSummary: feed.qaSummary,
  };
}

export function evaluateFveOptimizerQa(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const optimizers = Array.isArray(project.fve.optimizers) ? project.fve.optimizers : [];
  const findings = [];

  optimizers.forEach((optimizer, index) => {
    if (optimizer.finalDesign === true || optimizer.normative === true || optimizer.placeholder === false) {
      findings.push(createQaFinding("FVE-OPT-001", "WARN", "Optimizer placeholder must not be presented as a final design.", {
        source: "FVE_OPTIMIZER_V535",
        optimizerId: optimizer.optimizerId || optimizer.id || `optimizer-${index + 1}`,
      }));
    }
  });

  if (project.fve.optimizerFinalDesign === true) {
    findings.push(createQaFinding("FVE-OPT-001", "WARN", "Optimizer placeholder must not be presented as a final design.", {
      source: "FVE_OPTIMIZER_V535",
      optimizerId: "project.fve.optimizerFinalDesign",
    }));
  }

  return findings;
}
