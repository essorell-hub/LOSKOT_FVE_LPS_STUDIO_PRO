import assert from 'node:assert/strict';
import {
  APP_STATE_SHELL_CONNECTOR_STATUS,
  APP_STATE_SHELL_CONNECTOR_VERSION,
  createAppStateShellConnector,
  resolveAppStateShellRoute,
  validateAppStateShellConnector
} from '../../src/runtime/appStateShellConnectorV156.js';

console.log('Starting V156 FAST App State Shell Connector smoke test...');

const dashboardConnector = createAppStateShellConnector({ activeRouteKey: 'dashboard' });
assert.equal(dashboardConnector.connectorVersion, APP_STATE_SHELL_CONNECTOR_VERSION);
assert.equal(dashboardConnector.status, APP_STATE_SHELL_CONNECTOR_STATUS.READY);
assert.equal(dashboardConnector.visualStyleLocked, true);
assert.equal(dashboardConnector.renderingAllowed, false);
assert.equal(dashboardConnector.activeRouteKey, 'dashboard');
assert.equal(dashboardConnector.activeScreen.id, 'APPROVED_SCREEN_DASHBOARD_01_VARIANT_A');
assert.equal(dashboardConnector.stateSnapshot.navigationCount, 15);
assert.equal(dashboardConnector.actionContract.visualMutationAllowed, false);
assert.equal(dashboardConnector.qa.ok, true);
assert.equal(dashboardConnector.qa.shellOk, true);
assert.equal(dashboardConnector.qa.appStateControllerPresent, true);
assert.equal(dashboardConnector.qa.classicUiRuntimeAdapterPresent, true);

const documentsConnector = createAppStateShellConnector({ activeRouteKey: 'documents' });
assert.equal(documentsConnector.activeRouteKey, 'documents');
assert.equal(documentsConnector.activeScreen.labelCs, 'Dokumenty');
assert.equal(documentsConnector.stateSnapshot.activeScreenLabelCs, 'Dokumenty');

const fallback = resolveAppStateShellRoute('missing-route');
assert.equal(fallback.requestedRouteKey, 'missing-route');
assert.equal(fallback.resolvedRouteKey, 'dashboard');
assert.equal(fallback.fallbackUsed, true);
assert.equal(fallback.qaOk, true);

const validation = validateAppStateShellConnector(documentsConnector);
assert.equal(validation.ok, true);
assert.equal(validation.connectorVersion, APP_STATE_SHELL_CONNECTOR_VERSION);
assert.equal(validation.activeRouteKey, 'documents');
assert.equal(validation.navigationCount, 15);
assert.equal(validation.errors.length, 0);

console.log('V156 FAST App State Shell Connector smoke test passed:', JSON.stringify(validation, null, 2));
