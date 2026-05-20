// LOSKOT FVE & LPS STUDIO PRO
// V205 App Shell Runtime Milestone

import { createAppShellRuntimeWorkPlan, validateAppShellRuntimeWorkPlan } from './appShellRuntimeWorkPlanV204.js';

export const APP_SHELL_RUNTIME_MILESTONE_VERSION = 'v205-app-shell-runtime-milestone';

export function createAppShellRuntimeMilestone(options = {}) {
  const workPlan = createAppShellRuntimeWorkPlan(options);
  const validation = validateAppShellRuntimeWorkPlan(workPlan);
  return {
    milestoneVersion: APP_SHELL_RUNTIME_MILESTONE_VERSION,
    status: validation.ok ? 'READY_FOR_SAFE_VISIBLE_ATTACHMENT' : 'BLOCKED',
    ready: validation.ok,
    visualMutationAllowed: false,
    committedScope: 'runtime-models-only',
    nextRecommendedStep: 'V206-V220 safe visible shell data attachment',
    workPlan,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateAppShellRuntimeMilestone(model = createAppShellRuntimeMilestone()) {
  const errors = [];
  if (model.milestoneVersion !== APP_SHELL_RUNTIME_MILESTONE_VERSION) errors.push('Unexpected V205 version.');
  if (model.visualMutationAllowed !== false) errors.push('V205 must not mutate visuals.');
  if (model.status !== 'READY_FOR_SAFE_VISIBLE_ATTACHMENT') errors.push('V205 status is not ready.');
  if (!model.qa || model.qa.ok !== true) errors.push('V205 QA is not OK.');
  return { ok: errors.length === 0, version: model.milestoneVersion, status: model.status, nextRecommendedStep: model.nextRecommendedStep, errors };
}
