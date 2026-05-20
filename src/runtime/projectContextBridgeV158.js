// LOSKOT FVE & LPS STUDIO PRO
// V158 FAST Project Context Bridge
//
// Project context contract for app runtime shell. No visual mutation.

import {
  RUNTIME_ACTION_DISPATCHER_VERSION,
  createRuntimeActionDispatcher,
  dispatchRuntimeAction,
  validateRuntimeActionDispatcher
} from './runtimeActionDispatcherV157.js';

export const PROJECT_CONTEXT_BRIDGE_VERSION = 'v158-fast-project-context-bridge';

export function createDefaultProjectContext(overrides = {}) {
  return {
    projectId: overrides.projectId || 'LOSKOT-DEMO-PROJECT',
    projectName: overrides.projectName || 'LOSKOT FVE & LPS Studio PRO – interní zakázka',
    customerName: overrides.customerName || 'Interní OSVČ projekt',
    objectType: overrides.objectType || 'FVE + LPS objekt',
    revision: overrides.revision || 'pracovní',
    source: 'V158 project context bridge'
  };
}

export function createProjectContextBridge(options = {}) {
  const projectContext = createDefaultProjectContext(options.projectContext || {});
  const dispatcher = createRuntimeActionDispatcher({ activeRouteKey: options.activeRouteKey });
  const dispatcherValidation = validateRuntimeActionDispatcher(dispatcher);
  const routeAction = dispatchRuntimeAction({
    type: 'set-active-route',
    routeKey: options.activeRouteKey || dispatcher.connector.activeRouteKey
  });

  return {
    bridgeVersion: PROJECT_CONTEXT_BRIDGE_VERSION,
    dispatcherVersion: RUNTIME_ACTION_DISPATCHER_VERSION,
    ready: dispatcherValidation.ok && routeAction.ok,
    visualMutationAllowed: false,
    activeRouteKey: routeAction.resolvedRouteKey,
    activeScreen: routeAction.activeScreen,
    projectContext,
    dispatcher,
    routeAction,
    qa: {
      ok: dispatcherValidation.ok && routeAction.ok,
      dispatcherOk: dispatcherValidation.ok,
      routeActionOk: routeAction.ok,
      projectContextPresent: Boolean(projectContext.projectId && projectContext.projectName),
      visualMutationAllowed: false,
      errors: dispatcherValidation.errors
    }
  };
}

export function getProjectContextShellSummary(bridge = createProjectContextBridge()) {
  return {
    bridgeVersion: bridge.bridgeVersion,
    ready: bridge.ready,
    activeRouteKey: bridge.activeRouteKey,
    activeScreenId: bridge.activeScreen ? bridge.activeScreen.id : null,
    projectId: bridge.projectContext.projectId,
    projectName: bridge.projectContext.projectName,
    qaOk: bridge.qa.ok,
    visualMutationAllowed: bridge.visualMutationAllowed
  };
}

export function validateProjectContextBridge(bridge = createProjectContextBridge()) {
  const errors = [];

  if (bridge.bridgeVersion !== PROJECT_CONTEXT_BRIDGE_VERSION) {
    errors.push('Unexpected V158 bridge version.');
  }

  if (bridge.dispatcherVersion !== RUNTIME_ACTION_DISPATCHER_VERSION) {
    errors.push('Unexpected V157 dispatcher version.');
  }

  if (bridge.visualMutationAllowed !== false) {
    errors.push('Project context bridge must not allow visual mutation.');
  }

  if (!bridge.projectContext || !bridge.projectContext.projectId || !bridge.projectContext.projectName) {
    errors.push('Project context is incomplete.');
  }

  if (!bridge.qa || bridge.qa.ok !== true) {
    errors.push('Bridge QA is not OK.');
  }

  return {
    ok: errors.length === 0,
    bridgeVersion: bridge.bridgeVersion,
    activeRouteKey: bridge.activeRouteKey,
    projectId: bridge.projectContext ? bridge.projectContext.projectId : null,
    errors
  };
}
