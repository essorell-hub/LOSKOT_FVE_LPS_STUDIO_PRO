// LOSKOT FVE & LPS STUDIO PRO
// V215 Visible Shell Module Selection Bridge

import { createVisibleShellRouteSelectionBridge, validateVisibleShellRouteSelectionBridge } from './visibleShellRouteSelectionBridgeV214.js';

export const VISIBLE_SHELL_MODULE_SELECTION_BRIDGE_VERSION = 'v215-visible-shell-module-selection-bridge';

export function createVisibleShellModuleSelectionBridge(options = {}) {
  const route = createVisibleShellRouteSelectionBridge(options);
  const validation = validateVisibleShellRouteSelectionBridge(route);
  const moduleSelection = {
    activeRouteKey: route.routeSelection.activeRouteKey,
    activeModuleId: route.routeSelection.activeRouteKey,
    readOnly: true,
    canMutateModuleState: false
  };
  return {
    bridgeVersion: VISIBLE_SHELL_MODULE_SELECTION_BRIDGE_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    moduleSelection,
    route,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateVisibleShellModuleSelectionBridge(model = createVisibleShellModuleSelectionBridge()) {
  const errors = [];
  if (model.bridgeVersion !== VISIBLE_SHELL_MODULE_SELECTION_BRIDGE_VERSION) errors.push('Unexpected V215 version.');
  if (model.visualMutationAllowed !== false) errors.push('V215 must not mutate visuals.');
  if (!model.moduleSelection || model.moduleSelection.canMutateModuleState !== false) errors.push('V215 module bridge unsafe.');
  if (!model.qa || model.qa.ok !== true) errors.push('V215 QA is not OK.');
  return { ok: errors.length === 0, version: model.bridgeVersion, activeModuleId: model.moduleSelection?.activeModuleId || null, errors };
}
