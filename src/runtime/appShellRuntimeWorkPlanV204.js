// LOSKOT FVE & LPS STUDIO PRO
// V204 App Shell Runtime Work Plan

import { createAppShellRuntimeReleaseGate, validateAppShellRuntimeReleaseGate } from './appShellRuntimeReleaseGateV203.js';

export const APP_SHELL_RUNTIME_WORK_PLAN_VERSION = 'v204-app-shell-runtime-work-plan';

export function createAppShellRuntimeWorkPlan(options = {}) {
  const releaseGate = createAppShellRuntimeReleaseGate(options);
  const validation = validateAppShellRuntimeReleaseGate(releaseGate);
  const workItems = [
    { order: 1, key: 'connect-left-menu-runtime-data', ready: true },
    { order: 2, key: 'connect-workspace-runtime-data', ready: true },
    { order: 3, key: 'connect-right-qa-runtime-data', ready: true },
    { order: 4, key: 'connect-project-inspector-runtime-data', ready: true },
    { order: 5, key: 'keep-visual-baseline-locked', ready: true }
  ];
  return {
    planVersion: APP_SHELL_RUNTIME_WORK_PLAN_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    workItems,
    releaseGate,
    qa: { ok: validation.ok && workItems.every((item) => item.ready), workItemCount: workItems.length, errors: validation.errors }
  };
}

export function validateAppShellRuntimeWorkPlan(model = createAppShellRuntimeWorkPlan()) {
  const errors = [];
  if (model.planVersion !== APP_SHELL_RUNTIME_WORK_PLAN_VERSION) errors.push('Unexpected V204 version.');
  if (model.visualMutationAllowed !== false) errors.push('V204 must not mutate visuals.');
  if (!Array.isArray(model.workItems) || model.workItems.length !== 5) errors.push('V204 work item count must be 5.');
  if (!model.qa || model.qa.ok !== true) errors.push('V204 QA is not OK.');
  return { ok: errors.length === 0, version: model.planVersion, workItemCount: model.workItems?.length || 0, errors };
}
