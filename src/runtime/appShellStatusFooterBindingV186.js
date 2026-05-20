// LOSKOT FVE & LPS STUDIO PRO
// V186 App Shell Status Footer Binding

import { createAppShellProjectHeaderBinding, validateAppShellProjectHeaderBinding } from './appShellProjectHeaderBindingV185.js';

export const APP_SHELL_STATUS_FOOTER_BINDING_VERSION = 'v186-app-shell-status-footer-binding';

export function createAppShellStatusFooterBinding(options = {}) {
  const header = createAppShellProjectHeaderBinding(options);
  const validation = validateAppShellProjectHeaderBinding(header);
  const statusFooterBinding = {
    region: 'status-footer',
    readOnly: true,
    ...header.qaPanel.workspace.navigation.binder.bindingPacket.statusFooter
  };
  return {
    bindingVersion: APP_SHELL_STATUS_FOOTER_BINDING_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    statusFooterBinding,
    header,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateAppShellStatusFooterBinding(model = createAppShellStatusFooterBinding()) {
  const errors = [];
  if (model.bindingVersion !== APP_SHELL_STATUS_FOOTER_BINDING_VERSION) errors.push('Unexpected V186 version.');
  if (model.visualMutationAllowed !== false) errors.push('V186 must not mutate visuals.');
  if (!model.statusFooterBinding || model.statusFooterBinding.readOnly !== true) errors.push('V186 footer must be read-only.');
  if (!model.qa || model.qa.ok !== true) errors.push('V186 QA is not OK.');
  return { ok: errors.length === 0, version: model.bindingVersion, status: model.statusFooterBinding?.status || null, errors };
}
