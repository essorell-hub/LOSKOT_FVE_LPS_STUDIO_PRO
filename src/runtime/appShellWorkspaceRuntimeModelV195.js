// LOSKOT FVE & LPS STUDIO PRO
// V195 App Shell Workspace Runtime Model

import { createAppShellLeftMenuRuntimeModel, validateAppShellLeftMenuRuntimeModel } from './appShellLeftMenuRuntimeModelV194.js';

export const APP_SHELL_WORKSPACE_RUNTIME_MODEL_VERSION = 'v195-app-shell-workspace-runtime-model';

export function createAppShellWorkspaceRuntimeModel(options = {}) {
  const leftMenu = createAppShellLeftMenuRuntimeModel(options);
  const validation = validateAppShellLeftMenuRuntimeModel(leftMenu);
  const workspace = {
    activeRouteKey: leftMenu.modules.routes.mount.plan.gate.validator.snapshotModel.snapshot.workspace.activeRouteKey,
    renderMode: 'read-only-runtime-model',
    moduleCount: leftMenu.leftMenu.length,
    canWriteUi: false,
    canChangeLayout: false
  };
  return {
    modelVersion: APP_SHELL_WORKSPACE_RUNTIME_MODEL_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    workspace,
    leftMenu,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateAppShellWorkspaceRuntimeModel(model = createAppShellWorkspaceRuntimeModel()) {
  const errors = [];
  if (model.modelVersion !== APP_SHELL_WORKSPACE_RUNTIME_MODEL_VERSION) errors.push('Unexpected V195 version.');
  if (model.visualMutationAllowed !== false) errors.push('V195 must not mutate visuals.');
  if (!model.workspace || model.workspace.canWriteUi !== false || model.workspace.canChangeLayout !== false) errors.push('V195 workspace unsafe.');
  if (!model.qa || model.qa.ok !== true) errors.push('V195 QA is not OK.');
  return { ok: errors.length === 0, version: model.modelVersion, activeRouteKey: model.workspace?.activeRouteKey || null, errors };
}
