// LOSKOT FVE & LPS STUDIO PRO
// V185 App Shell Project Header Binding

import { createAppShellQaPanelBinding, validateAppShellQaPanelBinding } from './appShellQaPanelBindingV184.js';

export const APP_SHELL_PROJECT_HEADER_BINDING_VERSION = 'v185-app-shell-project-header-binding';

export function createAppShellProjectHeaderBinding(options = {}) {
  const qaPanel = createAppShellQaPanelBinding(options);
  const validation = validateAppShellQaPanelBinding(qaPanel);
  const projectHeaderBinding = {
    region: 'project-header',
    readOnly: true,
    ...qaPanel.workspace.navigation.binder.bindingPacket.projectHeader
  };
  return {
    bindingVersion: APP_SHELL_PROJECT_HEADER_BINDING_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    projectHeaderBinding,
    qaPanel,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateAppShellProjectHeaderBinding(model = createAppShellProjectHeaderBinding()) {
  const errors = [];
  if (model.bindingVersion !== APP_SHELL_PROJECT_HEADER_BINDING_VERSION) errors.push('Unexpected V185 version.');
  if (model.visualMutationAllowed !== false) errors.push('V185 must not mutate visuals.');
  if (!model.projectHeaderBinding || model.projectHeaderBinding.readOnly !== true) errors.push('V185 header must be read-only.');
  if (!model.qa || model.qa.ok !== true) errors.push('V185 QA is not OK.');
  return { ok: errors.length === 0, version: model.bindingVersion, projectId: model.projectHeaderBinding?.projectId || null, errors };
}
