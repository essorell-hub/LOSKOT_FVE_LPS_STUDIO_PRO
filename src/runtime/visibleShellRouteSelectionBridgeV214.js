// LOSKOT FVE & LPS STUDIO PRO
// V214 Visible Shell Route Selection Bridge

import { createVisibleShellRuntimeStoreBridge, validateVisibleShellRuntimeStoreBridge } from './visibleShellRuntimeStoreBridgeV213.js';

export const VISIBLE_SHELL_ROUTE_SELECTION_BRIDGE_VERSION = 'v214-visible-shell-route-selection-bridge';

export function createVisibleShellRouteSelectionBridge(options = {}) {
  const store = createVisibleShellRuntimeStoreBridge(options);
  const validation = validateVisibleShellRuntimeStoreBridge(store);
  const routeSelection = {
    activeRouteKey: options.activeRouteKey || 'dashboard',
    readOnly: true,
    canMutateRouteState: false
  };
  return {
    bridgeVersion: VISIBLE_SHELL_ROUTE_SELECTION_BRIDGE_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    routeSelection,
    store,
    qa: { ok: validation.ok, errors: validation.errors }
  };
}

export function validateVisibleShellRouteSelectionBridge(model = createVisibleShellRouteSelectionBridge()) {
  const errors = [];
  if (model.bridgeVersion !== VISIBLE_SHELL_ROUTE_SELECTION_BRIDGE_VERSION) errors.push('Unexpected V214 version.');
  if (model.visualMutationAllowed !== false) errors.push('V214 must not mutate visuals.');
  if (!model.routeSelection || model.routeSelection.canMutateRouteState !== false) errors.push('V214 route bridge unsafe.');
  if (!model.qa || model.qa.ok !== true) errors.push('V214 QA is not OK.');
  return { ok: errors.length === 0, version: model.bridgeVersion, activeRouteKey: model.routeSelection?.activeRouteKey || null, errors };
}
