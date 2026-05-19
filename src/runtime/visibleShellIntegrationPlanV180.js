// LOSKOT FVE & LPS STUDIO PRO
// V180 Visible Shell Integration Plan

import {
  VISIBLE_SHELL_PREFLIGHT_GATE_VERSION,
  createVisibleShellPreflightGate,
  validateVisibleShellPreflightGate
} from './visibleShellPreflightGateV179.js';

export const VISIBLE_SHELL_INTEGRATION_PLAN_VERSION = 'v180-visible-shell-integration-plan';

export function createVisibleShellIntegrationPlan(options = {}) {
  const gate = createVisibleShellPreflightGate(options);
  const validation = validateVisibleShellPreflightGate(gate);
  const plan = [
    { order: 1, key: 'bind-navigation-feed', allowed: true },
    { order: 2, key: 'bind-workspace-feed', allowed: true },
    { order: 3, key: 'bind-qa-feed', allowed: true },
    { order: 4, key: 'bind-project-header-feed', allowed: true },
    { order: 5, key: 'bind-status-footer-feed', allowed: true },
    { order: 6, key: 'modify-visual-layout', allowed: false }
  ];
  return {
    planVersion: VISIBLE_SHELL_INTEGRATION_PLAN_VERSION,
    preflightGateVersion: VISIBLE_SHELL_PREFLIGHT_GATE_VERSION,
    readyForNextStep: validation.ok,
    visualMutationAllowed: false,
    plan,
    gate,
    qa: { ok: validation.ok, planCount: plan.length, errors: validation.errors }
  };
}

export function validateVisibleShellIntegrationPlan(model = createVisibleShellIntegrationPlan()) {
  const errors = [];
  if (model.planVersion !== VISIBLE_SHELL_INTEGRATION_PLAN_VERSION) errors.push('Unexpected V180 version.');
  if (model.visualMutationAllowed !== false) errors.push('V180 must not allow visual mutation.');
  if (!Array.isArray(model.plan) || model.plan.length !== 6) errors.push('V180 plan count must be 6.');
  if (model.plan.some((item) => item.key === 'modify-visual-layout' && item.allowed !== false)) errors.push('V180 must block visual layout modification.');
  if (!model.qa || model.qa.ok !== true) errors.push('V180 QA is not OK.');
  return { ok: errors.length === 0, version: model.planVersion, readyForNextStep: model.readyForNextStep, planCount: model.plan?.length || 0, errors };
}
