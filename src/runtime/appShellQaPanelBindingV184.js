// LOSKOT FVE & LPS STUDIO PRO
// V184 App Shell QA Panel Binding

import { createAppShellWorkspaceBinding, validateAppShellWorkspaceBinding } from './appShellWorkspaceBindingV183.js';

export const APP_SHELL_QA_PANEL_BINDING_VERSION = 'v184-app-shell-qa-panel-binding';

export function createAppShellQaPanelBinding(options = {}) {
  const workspace = createAppShellWorkspaceBinding(options);
  const validation = validateAppShellWorkspaceBinding(workspace);
  const qaPanelBinding = {
    region: 'right-qa-panel',
    readOnly: true,
    failedCount: workspace.navigation.binder.bindingPacket.qa.failedCount,
    items: workspace.navigation.binder.bindingPacket.qa
  };
  return {
    bindingVersion: APP_SHELL_QA_PANEL_BINDING_VERSION,
    ready: validation.ok && qaPanelBinding.failedCount === 0,
    visualMutationAllowed: false,
    qaPanelBinding,
    workspace,
    qa: { ok: validation.ok && qaPanelBinding.failedCount === 0, errors: validation.errors }
  };
}

export function validateAppShellQaPanelBinding(model = createAppShellQaPanelBinding()) {
  const errors = [];
  if (model.bindingVersion !== APP_SHELL_QA_PANEL_BINDING_VERSION) errors.push('Unexpected V184 version.');
  if (model.visualMutationAllowed !== false) errors.push('V184 must not mutate visuals.');
  if (!model.qaPanelBinding || model.qaPanelBinding.readOnly !== true) errors.push('V184 QA panel must be read-only.');
  if (!model.qa || model.qa.ok !== true) errors.push('V184 QA is not OK.');
  return { ok: errors.length === 0, version: model.bindingVersion, failedCount: model.qaPanelBinding?.failedCount ?? null, errors };
}
