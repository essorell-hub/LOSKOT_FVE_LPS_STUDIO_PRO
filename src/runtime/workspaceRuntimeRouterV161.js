// LOSKOT FVE & LPS STUDIO PRO
// V161 Workspace Runtime Router

import {
  MODULE_RUNTIME_REGISTRY_VERSION,
  createModuleRuntimeRegistry,
  resolveModuleForRoute,
  validateModuleRuntimeRegistry
} from './moduleRuntimeRegistryV160.js';

export const WORKSPACE_RUNTIME_ROUTER_VERSION = 'v161-workspace-runtime-router';

export function createWorkspaceRuntimeRouter(options = {}) {
  const registry = createModuleRuntimeRegistry({ activeRouteKey: options.activeRouteKey, projectContext: options.projectContext });
  const registryValidation = validateModuleRuntimeRegistry(registry);
  const routeResolution = resolveModuleForRoute(options.activeRouteKey || registry.activeRouteKey, registry);

  return {
    routerVersion: WORKSPACE_RUNTIME_ROUTER_VERSION,
    registryVersion: MODULE_RUNTIME_REGISTRY_VERSION,
    ready: registryValidation.ok && routeResolution.moduleReady,
    visualMutationAllowed: false,
    activeRouteKey: routeResolution.resolvedRouteKey,
    activeModuleId: routeResolution.moduleId,
    activeModuleLabelCs: routeResolution.moduleLabelCs,
    workspacePayload: {
      routeKey: routeResolution.resolvedRouteKey,
      moduleId: routeResolution.moduleId,
      moduleLabelCs: routeResolution.moduleLabelCs,
      renderMode: 'runtime-contract-only',
      approvedVisualMutation: false
    },
    registry,
    qa: {
      ok: registryValidation.ok && routeResolution.moduleReady,
      registryOk: registryValidation.ok,
      routeResolved: Boolean(routeResolution.resolvedRouteKey),
      errors: registryValidation.errors
    }
  };
}

export function validateWorkspaceRuntimeRouter(router = createWorkspaceRuntimeRouter()) {
  const errors = [];
  if (router.routerVersion !== WORKSPACE_RUNTIME_ROUTER_VERSION) errors.push('Unexpected V161 router version.');
  if (router.registryVersion !== MODULE_RUNTIME_REGISTRY_VERSION) errors.push('Unexpected V160 registry version.');
  if (router.visualMutationAllowed !== false) errors.push('Workspace router must not allow visual mutation.');
  if (!router.workspacePayload || router.workspacePayload.approvedVisualMutation !== false) errors.push('Workspace payload must block visual mutation.');
  if (!router.qa || router.qa.ok !== true) errors.push('Workspace router QA is not OK.');
  return { ok: errors.length === 0, routerVersion: router.routerVersion, activeRouteKey: router.activeRouteKey, activeModuleId: router.activeModuleId, errors };
}
