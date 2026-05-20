// LOSKOT FVE & LPS STUDIO PRO
// V182 App Shell Navigation Binding

import { createAppShellReadOnlyDataBinder, validateAppShellReadOnlyDataBinder } from './appShellReadOnlyDataBinderV181.js';

export const APP_SHELL_NAVIGATION_BINDING_VERSION = 'v182-app-shell-navigation-binding';

export function createAppShellNavigationBinding(options = {}) {
  const binder = createAppShellReadOnlyDataBinder(options);
  const validation = validateAppShellReadOnlyDataBinder(binder);
  const navigationBinding = {
    region: 'left-navigation',
    readOnly: true,
    itemCount: binder.bindingPacket.navigation.length,
    items: binder.bindingPacket.navigation
  };
  return {
    bindingVersion: APP_SHELL_NAVIGATION_BINDING_VERSION,
    ready: validation.ok && navigationBinding.itemCount === 13,
    visualMutationAllowed: false,
    navigationBinding,
    binder,
    qa: { ok: validation.ok && navigationBinding.itemCount === 13, errors: validation.errors }
  };
}

export function validateAppShellNavigationBinding(model = createAppShellNavigationBinding()) {
  const errors = [];
  if (model.bindingVersion !== APP_SHELL_NAVIGATION_BINDING_VERSION) errors.push('Unexpected V182 version.');
  if (model.visualMutationAllowed !== false) errors.push('V182 must not mutate visuals.');
  if (!model.navigationBinding || model.navigationBinding.itemCount !== 13) errors.push('V182 navigation count must be 13.');
  if (!model.qa || model.qa.ok !== true) errors.push('V182 QA is not OK.');
  return { ok: errors.length === 0, version: model.bindingVersion, itemCount: model.navigationBinding?.itemCount || 0, errors };
}
