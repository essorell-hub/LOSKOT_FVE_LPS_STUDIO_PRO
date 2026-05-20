// LOSKOT FVE & LPS STUDIO PRO
// V190 App Shell Runtime Attachment Plan

import { createAppShellNoVisualMutationGate, validateAppShellNoVisualMutationGate } from './appShellNoVisualMutationGateV189.js';

export const APP_SHELL_RUNTIME_ATTACHMENT_PLAN_VERSION = 'v190-app-shell-runtime-attachment-plan';

export function createAppShellRuntimeAttachmentPlan(options = {}) {
  const gate = createAppShellNoVisualMutationGate(options);
  const validation = validateAppShellNoVisualMutationGate(gate);
  const steps = [
    { order: 1, key: 'attach-navigation-data', allowed: true },
    { order: 2, key: 'attach-workspace-data', allowed: true },
    { order: 3, key: 'attach-qa-panel-data', allowed: true },
    { order: 4, key: 'attach-header-data', allowed: true },
    { order: 5, key: 'attach-footer-data', allowed: true },
    { order: 6, key: 'change-css-or-layout', allowed: false }
  ];
  return {
    planVersion: APP_SHELL_RUNTIME_ATTACHMENT_PLAN_VERSION,
    readyForImplementation: validation.ok,
    visualMutationAllowed: false,
    steps,
    gate,
    qa: { ok: validation.ok, stepCount: steps.length, errors: validation.errors }
  };
}

export function validateAppShellRuntimeAttachmentPlan(model = createAppShellRuntimeAttachmentPlan()) {
  const errors = [];
  if (model.planVersion !== APP_SHELL_RUNTIME_ATTACHMENT_PLAN_VERSION) errors.push('Unexpected V190 version.');
  if (model.visualMutationAllowed !== false) errors.push('V190 must not mutate visuals.');
  if (!Array.isArray(model.steps) || model.steps.length !== 6) errors.push('V190 step count must be 6.');
  if (model.steps.some((step) => step.key === 'change-css-or-layout' && step.allowed !== false)) errors.push('V190 must block CSS/layout changes.');
  if (!model.qa || model.qa.ok !== true) errors.push('V190 QA is not OK.');
  return { ok: errors.length === 0, version: model.planVersion, readyForImplementation: model.readyForImplementation, stepCount: model.steps?.length || 0, errors };
}
