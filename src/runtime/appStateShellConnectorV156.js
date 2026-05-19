// LOSKOT FVE & LPS STUDIO PRO
// V156 FAST App State Shell Connector
//
// Additive connector between V155 app runtime shell and app state/controller metadata.
// No visual rendering or UI mutation is performed here.

import * as appStateControllerModule from './appStateController.js';
import * as classicUiRuntimeAdapterModule from './classicUiRuntimeAdapter.js';
import {
  APP_RUNTIME_SHELL_VERSION,
  createAppRuntimeShell,
  getAppRuntimeShellRouteSummary,
  validateAppRuntimeShell
} from './appRuntimeShellV155.js';

export const APP_STATE_SHELL_CONNECTOR_VERSION = 'v156-fast-app-state-shell-connector';

export const APP_STATE_SHELL_CONNECTOR_STATUS = Object.freeze({
  READY: 'READY',
  DEGRADED: 'DEGRADED',
  BLOCKED: 'BLOCKED'
});

export function inspectRuntimeModule(moduleNamespace, moduleName) {
  const exportNames = Object.keys(moduleNamespace || {}).sort();

  return {
    moduleName,
    modulePresent: Boolean(moduleNamespace),
    exportCount: exportNames.length,
    exportNames,
    hasExports: exportNames.length > 0
  };
}

export function createAppStateShellConnector(options = {}) {
  const shell = createAppRuntimeShell({ activeRouteKey: options.activeRouteKey });
  const shellValidation = validateAppRuntimeShell(shell);
  const shellSummary = getAppRuntimeShellRouteSummary(shell);
  const appStateController = inspectRuntimeModule(
    options.appStateControllerModule || appStateControllerModule,
    'appStateController'
  );
  const classicUiRuntimeAdapter = inspectRuntimeModule(
    options.classicUiRuntimeAdapterModule || classicUiRuntimeAdapterModule,
    'classicUiRuntimeAdapter'
  );

  const errors = [];
  const warnings = [];

  if (!shellValidation.ok) {
    errors.push('V155 app runtime shell validation is not OK.');
  }

  if (!appStateController.modulePresent) {
    errors.push('appStateController module is not available.');
  }

  if (!classicUiRuntimeAdapter.modulePresent) {
    errors.push('classicUiRuntimeAdapter module is not available.');
  }

  if (appStateController.exportCount === 0) {
    warnings.push('appStateController has no named exports; connector remains metadata-only.');
  }

  if (classicUiRuntimeAdapter.exportCount === 0) {
    warnings.push('classicUiRuntimeAdapter has no named exports; connector remains metadata-only.');
  }

  return {
    connectorVersion: APP_STATE_SHELL_CONNECTOR_VERSION,
    shellVersion: APP_RUNTIME_SHELL_VERSION,
    status: errors.length === 0 ? APP_STATE_SHELL_CONNECTOR_STATUS.READY : APP_STATE_SHELL_CONNECTOR_STATUS.BLOCKED,
    visualStyleLocked: true,
    renderingAllowed: false,
    activeRouteKey: shell.activeRouteKey,
    activeScreen: shell.activeScreen,
    shell,
    shellSummary,
    appStateController,
    classicUiRuntimeAdapter,
    stateSnapshot: {
      activeRouteKey: shell.activeRouteKey,
      activeScreenId: shell.activeScreen.id,
      activeScreenLabelCs: shell.activeScreen.labelCs,
      navigationCount: shell.navigation.length,
      qaOk: shell.qa.ok,
      visualStyleLocked: true
    },
    actionContract: {
      routeChangeAllowed: true,
      projectDataMutationAllowed: true,
      visualMutationAllowed: false,
      supportedActions: [
        'set-active-route',
        'refresh-runtime-shell',
        'refresh-qa-panel',
        'prepare-project-context'
      ]
    },
    qa: {
      ok: errors.length === 0,
      shellOk: shellValidation.ok,
      appStateControllerPresent: appStateController.modulePresent,
      classicUiRuntimeAdapterPresent: classicUiRuntimeAdapter.modulePresent,
      visualStyleLocked: true,
      renderingAllowed: false,
      errors,
      warnings
    }
  };
}

export function resolveAppStateShellRoute(routeKey) {
  const connector = createAppStateShellConnector({ activeRouteKey: routeKey });

  return {
    connectorVersion: connector.connectorVersion,
    requestedRouteKey: routeKey,
    resolvedRouteKey: connector.activeRouteKey,
    fallbackUsed: routeKey !== connector.activeRouteKey,
    activeScreen: connector.activeScreen,
    stateSnapshot: connector.stateSnapshot,
    qaOk: connector.qa.ok
  };
}

export function validateAppStateShellConnector(connector = createAppStateShellConnector()) {
  const errors = [];
  const warnings = [];

  if (connector.connectorVersion !== APP_STATE_SHELL_CONNECTOR_VERSION) {
    errors.push('Unexpected V156 connector version.');
  }

  if (connector.shellVersion !== APP_RUNTIME_SHELL_VERSION) {
    errors.push('Unexpected V155 shell version.');
  }

  if (connector.visualStyleLocked !== true) {
    errors.push('Visual style must remain locked.');
  }

  if (connector.renderingAllowed !== false) {
    errors.push('V156 connector must not render or alter visual UI.');
  }

  if (!connector.shell || !connector.qa || connector.qa.shellOk !== true) {
    errors.push('Shell QA is not OK.');
  }

  if (!connector.appStateController || connector.appStateController.modulePresent !== true) {
    errors.push('appStateController metadata is missing.');
  }

  if (!connector.classicUiRuntimeAdapter || connector.classicUiRuntimeAdapter.modulePresent !== true) {
    errors.push('classicUiRuntimeAdapter metadata is missing.');
  }

  if (!connector.stateSnapshot || connector.stateSnapshot.navigationCount !== 15) {
    errors.push('State snapshot does not contain approved navigation count.');
  }

  if (!connector.actionContract || connector.actionContract.visualMutationAllowed !== false) {
    errors.push('Action contract must block visual mutation.');
  }

  if (connector.qa && connector.qa.warnings) {
    warnings.push(...connector.qa.warnings);
  }

  return {
    ok: errors.length === 0,
    connectorVersion: connector.connectorVersion,
    status: connector.status,
    activeRouteKey: connector.activeRouteKey,
    activeScreenId: connector.activeScreen ? connector.activeScreen.id : null,
    navigationCount: connector.stateSnapshot ? connector.stateSnapshot.navigationCount : 0,
    errors,
    warnings
  };
}
