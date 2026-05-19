// LOSKOT FVE & LPS STUDIO PRO
// V198 App Shell Runtime Synchronization Plan

import { createAppShellProjectInspectorRuntimeModel, validateAppShellProjectInspectorRuntimeModel } from './appShellProjectInspectorRuntimeModelV197.js';

export const APP_SHELL_RUNTIME_SYNCHRONIZATION_PLAN_VERSION = 'v198-app-shell-runtime-synchronization-plan';

export function createAppShellRuntimeSynchronizationPlan(options = {}) {
  const inspector = createAppShellProjectInspectorRuntimeModel(options);
  const validation = validateAppShellProjectInspectorRuntimeModel(inspector);
  const syncSteps = [
    { key: 'read-project-context', allowed: true },
    { key: 'resolve-active-route', allowed: true },
    { key: 'refresh-runtime-models', allowed: true },
    { key: 'update-visual-layout', allowed: false }
  ];
  return {
    planVersion: APP_SHELL_RUNTIME_SYNCHRONIZATION_PLAN_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    syncSteps,
    inspector,
    qa: { ok: validation.ok, stepCount: syncSteps.length, errors: validation.errors }
  };
}

export function validateAppShellRuntimeSynchronizationPlan(model = createAppShellRuntimeSynchronizationPlan()) {
  const errors = [];
  if (model.planVersion !== APP_SHELL_RUNTIME_SYNCHRONIZATION_PLAN_VERSION) errors.push('Unexpected V198 version.');
  if (model.visualMutationAllowed !== false) errors.push('V198 must not mutate visuals.');
  if (!Array.isArray(model.syncSteps) || model.syncSteps.length !== 4) errors.push('V198 sync step count must be 4.');
  if (model.syncSteps.some((step) => step.key === 'update-visual-layout' && step.allowed !== false)) errors.push('V198 must block visual layout update.');
  if (!model.qa || model.qa.ok !== true) errors.push('V198 QA is not OK.');
  return { ok: errors.length === 0, version: model.planVersion, stepCount: model.syncSteps?.length || 0, errors };
}
