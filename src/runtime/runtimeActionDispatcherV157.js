// LOSKOT FVE & LPS STUDIO PRO
// V157 FAST Runtime Action Dispatcher
//
// Dispatch contract for state-driven shell operations. No visual mutation.

import {
  APP_STATE_SHELL_CONNECTOR_VERSION,
  createAppStateShellConnector,
  resolveAppStateShellRoute,
  validateAppStateShellConnector
} from './appStateShellConnectorV156.js';

export const RUNTIME_ACTION_DISPATCHER_VERSION = 'v157-fast-runtime-action-dispatcher';

export const RUNTIME_ACTION_TYPES = Object.freeze({
  SET_ACTIVE_ROUTE: 'set-active-route',
  REFRESH_RUNTIME_SHELL: 'refresh-runtime-shell',
  REFRESH_QA_PANEL: 'refresh-qa-panel',
  PREPARE_PROJECT_CONTEXT: 'prepare-project-context'
});

export function createRuntimeActionDispatcher(options = {}) {
  const connector = createAppStateShellConnector({ activeRouteKey: options.activeRouteKey });
  const validation = validateAppStateShellConnector(connector);

  return {
    dispatcherVersion: RUNTIME_ACTION_DISPATCHER_VERSION,
    connectorVersion: APP_STATE_SHELL_CONNECTOR_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    supportedActions: Object.values(RUNTIME_ACTION_TYPES),
    connector,
    validation
  };
}

export function dispatchRuntimeAction(action = {}, options = {}) {
  const type = action.type || RUNTIME_ACTION_TYPES.REFRESH_RUNTIME_SHELL;
  const dispatcher = createRuntimeActionDispatcher({
    activeRouteKey: action.routeKey || options.activeRouteKey
  });

  if (!dispatcher.supportedActions.includes(type)) {
    return {
      ok: false,
      type,
      error: 'Unsupported runtime action.',
      visualMutationAllowed: false
    };
  }

  if (type === RUNTIME_ACTION_TYPES.SET_ACTIVE_ROUTE) {
    const resolved = resolveAppStateShellRoute(action.routeKey || options.activeRouteKey || 'dashboard');
    return {
      ok: resolved.qaOk,
      type,
      requestedRouteKey: resolved.requestedRouteKey,
      resolvedRouteKey: resolved.resolvedRouteKey,
      fallbackUsed: resolved.fallbackUsed,
      activeScreen: resolved.activeScreen,
      visualMutationAllowed: false
    };
  }

  return {
    ok: dispatcher.ready,
    type,
    activeRouteKey: dispatcher.connector.activeRouteKey,
    activeScreen: dispatcher.connector.activeScreen,
    stateSnapshot: dispatcher.connector.stateSnapshot,
    visualMutationAllowed: false
  };
}

export function validateRuntimeActionDispatcher(dispatcher = createRuntimeActionDispatcher()) {
  const errors = [];

  if (dispatcher.dispatcherVersion !== RUNTIME_ACTION_DISPATCHER_VERSION) {
    errors.push('Unexpected V157 dispatcher version.');
  }

  if (dispatcher.connectorVersion !== APP_STATE_SHELL_CONNECTOR_VERSION) {
    errors.push('Unexpected V156 connector version.');
  }

  if (dispatcher.visualMutationAllowed !== false) {
    errors.push('Runtime dispatcher must not allow visual mutation.');
  }

  if (!Array.isArray(dispatcher.supportedActions) || dispatcher.supportedActions.length !== 4) {
    errors.push('Dispatcher supported action contract is invalid.');
  }

  if (!dispatcher.validation || dispatcher.validation.ok !== true) {
    errors.push('Underlying V156 connector validation is not OK.');
  }

  return {
    ok: errors.length === 0,
    dispatcherVersion: dispatcher.dispatcherVersion,
    activeRouteKey: dispatcher.connector ? dispatcher.connector.activeRouteKey : null,
    supportedActionCount: dispatcher.supportedActions ? dispatcher.supportedActions.length : 0,
    errors
  };
}
