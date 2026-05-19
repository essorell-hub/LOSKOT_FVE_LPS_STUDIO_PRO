// LOSKOT FVE & LPS STUDIO PRO
// V193 App Shell Module Runtime Map

import { createAppShellRouteRuntimeMap, validateAppShellRouteRuntimeMap } from './appShellRouteRuntimeMapV192.js';

export const APP_SHELL_MODULE_RUNTIME_MAP_VERSION = 'v193-app-shell-module-runtime-map';

export function createAppShellModuleRuntimeMap(options = {}) {
  const routes = createAppShellRouteRuntimeMap(options);
  const validation = validateAppShellRouteRuntimeMap(routes);
  const moduleMap = routes.routeMap.map((route) => ({
    moduleId: route.moduleId,
    routeKey: route.routeKey,
    hasNavigation: true,
    hasWorkspace: true,
    hasQa: true,
    ready: route.ready
  }));
  return {
    mapVersion: APP_SHELL_MODULE_RUNTIME_MAP_VERSION,
    ready: validation.ok && moduleMap.every((item) => item.ready),
    visualMutationAllowed: false,
    moduleMap,
    routes,
    qa: { ok: validation.ok && moduleMap.length === 13, moduleCount: moduleMap.length, errors: validation.errors }
  };
}

export function validateAppShellModuleRuntimeMap(model = createAppShellModuleRuntimeMap()) {
  const errors = [];
  if (model.mapVersion !== APP_SHELL_MODULE_RUNTIME_MAP_VERSION) errors.push('Unexpected V193 version.');
  if (model.visualMutationAllowed !== false) errors.push('V193 must not mutate visuals.');
  if (!Array.isArray(model.moduleMap) || model.moduleMap.length !== 13) errors.push('V193 module count must be 13.');
  if (!model.qa || model.qa.ok !== true) errors.push('V193 QA is not OK.');
  return { ok: errors.length === 0, version: model.mapVersion, moduleCount: model.moduleMap?.length || 0, errors };
}
