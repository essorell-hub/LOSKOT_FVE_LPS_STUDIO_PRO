// LOSKOT FVE & LPS STUDIO PRO
// V183 App Shell Workspace Binding

import { createAppShellNavigationBinding, validateAppShellNavigationBinding } from './appShellNavigationBindingV182.js';

export const APP_SHELL_WORKSPACE_BINDING_VERSION = 'v183-app-shell-workspace-binding';

export function createAppShellWorkspaceBinding(options = {}) {
  const navigation = createAppShellNavigationBinding(options);
  const validation = validateAppShellNavigationBinding(navigation);
  const workspaceBinding = {
    region: 'central-workspace',
    readOnly: true,
    activeRouteKey: navigation.binder.bindingPacket.workspace.activeRouteKey,
    renderMode: navigation.binder.bindingPacket.workspace.renderMode,
    canModifyLayout: false
  };
  return {
    bindingVersion: APP_SHELL_WORKSPACE_BINDING_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    workspaceBinding,
    navigation,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateAppShellWorkspaceBinding(model = createAppShellWorkspaceBinding()) {
  const errors = [];
  if (model.bindingVersion !== APP_SHELL_WORKSPACE_BINDING_VERSION) errors.push('Unexpected V183 version.');
  if (model.visualMutationAllowed !== false) errors.push('V183 must not mutate visuals.');
  if (!model.workspaceBinding || model.workspaceBinding.canModifyLayout !== false) errors.push('V183 workspace must be read-only.');
  if (!model.qa || model.qa.ok !== true) errors.push('V183 QA is not OK.');
  return { ok: errors.length === 0, version: model.bindingVersion, activeRouteKey: model.workspaceBinding?.activeRouteKey || null, errors };
}
