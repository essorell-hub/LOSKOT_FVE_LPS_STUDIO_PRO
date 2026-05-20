import { createProjectCommandBusV842 } from "../runtime/projectCommandBusV842.js";
import { PROJECT_COMMAND_TYPES_V841, createProjectCommandV841 } from "../runtime/projectCommandModelV841.js";

export function runProjectFullQaWorkflowV863(project = {}) {
  const bus = createProjectCommandBusV842({ project });
  const validate = bus.execute(createProjectCommandV841(PROJECT_COMMAND_TYPES_V841.PROJECT_VALIDATE, { project }));
  const fve = bus.execute(createProjectCommandV841(PROJECT_COMMAND_TYPES_V841.FVE_EVALUATE, { project }));
  const lps = bus.execute(createProjectCommandV841(PROJECT_COMMAND_TYPES_V841.LPS_EVALUATE, { project }));
  const qa = bus.execute(createProjectCommandV841(PROJECT_COMMAND_TYPES_V841.QA_RUN_ALL, { project }));
  const errors = [...validate.errors, ...fve.errors, ...lps.errors, ...qa.errors];
  const qaFindings = [...validate.qaFindings, ...fve.qaFindings, ...lps.qaFindings, ...qa.qaFindings];
  return {
    ok: errors.length === 0 && !qaFindings.some((finding) => ["BLOCKER", "ERROR"].includes(finding.severity)),
    data: { validate: validate.data, fve: fve.data, lps: lps.data, qa: qa.data },
    warnings: [...validate.warnings, ...fve.warnings, ...lps.warnings, ...qa.warnings],
    errors,
    qaFindings,
    operationLog: bus.getHistory()
  };
}
