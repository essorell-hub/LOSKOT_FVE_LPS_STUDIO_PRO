// LOSKOT FVE & LPS STUDIO PRO
// V162 QA Runtime Aggregator

import {
  WORKSPACE_RUNTIME_ROUTER_VERSION,
  createWorkspaceRuntimeRouter,
  validateWorkspaceRuntimeRouter
} from './workspaceRuntimeRouterV161.js';

export const QA_RUNTIME_AGGREGATOR_VERSION = 'v162-qa-runtime-aggregator';

export function createQaRuntimeAggregator(options = {}) {
  const router = createWorkspaceRuntimeRouter({ activeRouteKey: options.activeRouteKey, projectContext: options.projectContext });
  const routerValidation = validateWorkspaceRuntimeRouter(router);

  const checks = [
    { key: 'workspace-router', labelCs: 'Workspace router', ok: routerValidation.ok },
    { key: 'module-registry', labelCs: 'Module registry', ok: router.qa.registryOk },
    { key: 'route-resolution', labelCs: 'Route resolution', ok: router.qa.routeResolved },
    { key: 'visual-lock', labelCs: 'Visual lock', ok: router.visualMutationAllowed === false },
    { key: 'qa-feed', labelCs: 'QA feed', ok: router.registry.feed.qa.ok }
  ];

  const failed = checks.filter((check) => !check.ok);

  return {
    aggregatorVersion: QA_RUNTIME_AGGREGATOR_VERSION,
    routerVersion: WORKSPACE_RUNTIME_ROUTER_VERSION,
    ready: failed.length === 0,
    visualMutationAllowed: false,
    activeRouteKey: router.activeRouteKey,
    activeModuleId: router.activeModuleId,
    checks,
    router,
    qa: {
      ok: failed.length === 0,
      checkCount: checks.length,
      failedCount: failed.length,
      errors: [...routerValidation.errors, ...failed.map((check) => check.key)]
    }
  };
}

export function validateQaRuntimeAggregator(aggregator = createQaRuntimeAggregator()) {
  const errors = [];
  if (aggregator.aggregatorVersion !== QA_RUNTIME_AGGREGATOR_VERSION) errors.push('Unexpected V162 aggregator version.');
  if (aggregator.routerVersion !== WORKSPACE_RUNTIME_ROUTER_VERSION) errors.push('Unexpected V161 router version.');
  if (aggregator.visualMutationAllowed !== false) errors.push('QA aggregator must not allow visual mutation.');
  if (!Array.isArray(aggregator.checks) || aggregator.checks.length !== 5) errors.push('QA aggregator must contain 5 checks.');
  if (!aggregator.qa || aggregator.qa.ok !== true) errors.push('QA aggregator status is not OK.');
  return { ok: errors.length === 0, aggregatorVersion: aggregator.aggregatorVersion, activeRouteKey: aggregator.activeRouteKey, failedCount: aggregator.qa?.failedCount ?? null, errors };
}
