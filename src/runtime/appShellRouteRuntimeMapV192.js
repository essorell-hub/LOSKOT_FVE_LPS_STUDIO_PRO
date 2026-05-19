// LOSKOT FVE & LPS STUDIO PRO
// V192 App Shell Route Runtime Map

import { createAppShellRuntimeMountModel, validateAppShellRuntimeMountModel } from './appShellRuntimeMountModelV191.js';

export const APP_SHELL_ROUTE_RUNTIME_MAP_VERSION = 'v192-app-shell-route-runtime-map';

export function createAppShellRouteRuntimeMap(options = {}) {
  const mount = createAppShellRuntimeMountModel(options);
  const validation = validateAppShellRuntimeMountModel(mount);
  const routeMap = mount.plan.gate.validator.snapshotModel.snapshot.navigation.items.map((item) => ({
    routeKey: item.moduleId,
    moduleId: item.moduleId,
    active: item.active === true,
    ready: item.ready === true
  }));
  return {
    mapVersion: APP_SHELL_ROUTE_RUNTIME_MAP_VERSION,
    ready: validation.ok && routeMap.length === 13,
    visualMutationAllowed: false,
    routeMap,
    mount,
    qa: { ok: validation.ok && routeMap.length === 13, routeCount: routeMap.length, errors: validation.errors }
  };
}

export function validateAppShellRouteRuntimeMap(model = createAppShellRouteRuntimeMap()) {
  const errors = [];
  if (model.mapVersion !== APP_SHELL_ROUTE_RUNTIME_MAP_VERSION) errors.push('Unexpected V192 version.');
  if (model.visualMutationAllowed !== false) errors.push('V192 must not mutate visuals.');
  if (!Array.isArray(model.routeMap) || model.routeMap.length !== 13) errors.push('V192 route count must be 13.');
  if (!model.qa || model.qa.ok !== true) errors.push('V192 QA is not OK.');
  return { ok: errors.length === 0, version: model.mapVersion, routeCount: model.routeMap?.length || 0, errors };
}
