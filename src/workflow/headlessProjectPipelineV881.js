import { validateProject } from "../app/projectApplicationServiceV821.js";
import { evaluateFvePractical, collectFveBomInputs } from "../app/fveApplicationServiceV822.js";
import { evaluateLpsSpdGrounding } from "../app/lpsSpdApplicationServiceV823.js";
import { buildTechnicalReportSet } from "../app/documentsApplicationServiceV824.js";
import { buildBom, buildExportPackage } from "../app/exportApplicationServiceV825.js";
import { evaluateReleaseGate } from "../app/qaApplicationServiceV826.js";
import { createProjectPipelineStepV882, normalizeProjectPipelineStepResultV882 } from "./projectPipelineStepModelV882.js";
import { evaluateProjectPipelineQaGateV883 } from "./projectPipelineQaGateV883.js";
import { evaluateProjectPipelineExportGateV884 } from "./projectPipelineExportGateV884.js";
import { createProjectPipelineHandoffGateV885 } from "./projectPipelineHandoffGateV885.js";

function combineFindings(stepResults) {
  return stepResults.flatMap((step) => step.qaFindings || []);
}

export function createHeadlessProjectPipelineV881() {
  const steps = [
    createProjectPipelineStepV882("validate-project", "Validate project", (project) => {
      const validation = validateProject(project);
      return { ok: validation.valid, data: validation, warnings: validation.warnings, errors: validation.errors, qaFindings: validation.qaFindings };
    }),
    createProjectPipelineStepV882("evaluate-fve", "Evaluate FVE", (project) => evaluateFvePractical(project)),
    createProjectPipelineStepV882("evaluate-lps-spd-grounding", "Evaluate LPS/SPD/grounding", (project) => evaluateLpsSpdGrounding(project)),
    createProjectPipelineStepV882("collect-qa", "Collect QA", (project, context) => evaluateProjectPipelineQaGateV883(project, context)),
    createProjectPipelineStepV882("build-documents", "Build documents", (project, context) => buildTechnicalReportSet(project, context)),
    createProjectPipelineStepV882("build-bom", "Build BOM", (project, context) => buildBom(project, { ...context, fveBomInputs: collectFveBomInputs(project) })),
    createProjectPipelineStepV882("build-export-package", "Build export package", (project, context) => buildExportPackage(project, context)),
    createProjectPipelineStepV882("release-gate", "Release gate", (project, context) => {
      const gate = evaluateReleaseGate(project, context);
      return { ok: gate.releaseGo, data: gate, warnings: gate.releaseGo ? [] : ["RELEASE_GATE_CLOSED"], errors: gate.releaseGo ? [] : gate.reasons, qaFindings: gate.qaFindings };
    }),
    createProjectPipelineStepV882("handoff-snapshot", "Handoff snapshot", (project, context) => createProjectPipelineHandoffGateV885(project, context))
  ];

  function run(project = {}, initialContext = {}) {
    const context = { ...initialContext };
    const stepResults = [];
    for (const step of steps) {
      const result = normalizeProjectPipelineStepResultV882(step, step.run(project, context));
      stepResults.push(result);
      context[step.id] = result.data;
      context.qaFindings = combineFindings(stepResults);
      if (step.id === "build-documents") context.documentsReady = result.ok;
      if (step.id === "build-bom") context.bomReady = result.ok;
      if (step.id === "build-export-package") context.exportReady = result.ok;
      if (step.id === "release-gate") context.releaseGo = result.data?.releaseGo === true;
    }
    const hasStopper = stepResults.some((stepResult) => stepResult.errors.length > 0 || stepResult.qaFindings.some((finding) => ["BLOCKER", "ERROR"].includes(finding.severity)));
    const exportGate = evaluateProjectPipelineExportGateV884(project, context);
    return {
      ok: !hasStopper && context.releaseGo === true && exportGate.ok,
      releaseGo: !hasStopper && context.releaseGo === true,
      exportReady: !hasStopper && exportGate.ok,
      data: { steps: stepResults, context },
      warnings: stepResults.flatMap((stepResult) => stepResult.warnings),
      errors: stepResults.flatMap((stepResult) => stepResult.errors),
      qaFindings: combineFindings(stepResults),
      operationLog: stepResults.map((stepResult) => ({ stepId: stepResult.stepId, ok: stepResult.ok }))
    };
  }

  return { steps, run };
}

export function runHeadlessProjectPipelineV881(project = {}, context = {}) {
  return createHeadlessProjectPipelineV881().run(project, context);
}
