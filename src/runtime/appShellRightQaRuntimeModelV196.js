// LOSKOT FVE & LPS STUDIO PRO
// V196 App Shell Right QA Runtime Model

import { createAppShellWorkspaceRuntimeModel, validateAppShellWorkspaceRuntimeModel } from './appShellWorkspaceRuntimeModelV195.js';

export const APP_SHELL_RIGHT_QA_RUNTIME_MODEL_VERSION = 'v196-app-shell-right-qa-runtime-model';

export function createAppShellRightQaRuntimeModel(options = {}) {
  const workspace = createAppShellWorkspaceRuntimeModel(options);
  const validation = validateAppShellWorkspaceRuntimeModel(workspace);
  const rightQa = {
    status: validation.ok ? 'READY' : 'BLOCKED',
    failedCount: 0,
    readOnly: true,
    canWriteUi: false
  };
  return {
    modelVersion: APP_SHELL_RIGHT_QA_RUNTIME_MODEL_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    rightQa,
    workspace,
    qa: { ok: validation.ok && rightQa.failedCount === 0, failedCount: rightQa.failedCount, errors: validation.errors }
  };
}

export function validateAppShellRightQaRuntimeModel(model = createAppShellRightQaRuntimeModel()) {
  const errors = [];
  if (model.modelVersion !== APP_SHELL_RIGHT_QA_RUNTIME_MODEL_VERSION) errors.push('Unexpected V196 version.');
  if (model.visualMutationAllowed !== false) errors.push('V196 must not mutate visuals.');
  if (!model.rightQa || model.rightQa.canWriteUi !== false) errors.push('V196 QA model unsafe.');
  if (!model.qa || model.qa.ok !== true) errors.push('V196 QA is not OK.');
  return { ok: errors.length === 0, version: model.modelVersion, failedCount: model.rightQa?.failedCount ?? null, errors };
}
