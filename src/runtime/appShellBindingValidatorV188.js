// LOSKOT FVE & LPS STUDIO PRO
// V188 App Shell Binding Validator

import { createAppShellBindingSnapshot, validateAppShellBindingSnapshot } from './appShellBindingSnapshotV187.js';

export const APP_SHELL_BINDING_VALIDATOR_VERSION = 'v188-app-shell-binding-validator';

export function createAppShellBindingValidator(options = {}) {
  const snapshotModel = createAppShellBindingSnapshot(options);
  const snapshotValidation = validateAppShellBindingSnapshot(snapshotModel);
  const checks = Object.entries(snapshotModel.snapshot).map(([key, value]) => ({
    key,
    ok: Boolean(value && value.readOnly === true)
  }));
  const failed = checks.filter((check) => !check.ok);
  return {
    validatorVersion: APP_SHELL_BINDING_VALIDATOR_VERSION,
    ready: snapshotValidation.ok && failed.length === 0,
    visualMutationAllowed: false,
    checks,
    snapshotModel,
    qa: { ok: snapshotValidation.ok && failed.length === 0, checkCount: checks.length, failedCount: failed.length, errors: failed.map((check) => check.key) }
  };
}

export function validateAppShellBindingValidator(model = createAppShellBindingValidator()) {
  const errors = [];
  if (model.validatorVersion !== APP_SHELL_BINDING_VALIDATOR_VERSION) errors.push('Unexpected V188 version.');
  if (model.visualMutationAllowed !== false) errors.push('V188 must not mutate visuals.');
  if (!Array.isArray(model.checks) || model.checks.length !== 5) errors.push('V188 check count must be 5.');
  if (!model.qa || model.qa.ok !== true) errors.push('V188 QA is not OK.');
  return { ok: errors.length === 0, version: model.validatorVersion, failedCount: model.qa?.failedCount ?? null, errors };
}
