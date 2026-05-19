import assert from 'node:assert/strict';
import {
  APP_RUNTIME_SHELL_STATUS,
  APP_RUNTIME_SHELL_VERSION,
  createAppRuntimeShell,
  getAppRuntimeShellRouteSummary,
  validateAppRuntimeShell
} from '../../src/runtime/appRuntimeShellV155.js';

console.log('Starting V155 FAST App Runtime Shell smoke test...');

const dashboardShell = createAppRuntimeShell({ activeRouteKey: 'dashboard' });
assert.equal(dashboardShell.shellVersion, APP_RUNTIME_SHELL_VERSION);
assert.equal(dashboardShell.status, APP_RUNTIME_SHELL_STATUS.READY);
assert.equal(dashboardShell.visualStyleLocked, true);
assert.equal(dashboardShell.renderingAllowed, false);
assert.equal(dashboardShell.activeRouteKey, 'dashboard');
assert.equal(dashboardShell.activeScreen.id, 'APPROVED_SCREEN_DASHBOARD_01_VARIANT_A');
assert.equal(dashboardShell.navigation.length, 15);
assert.equal(dashboardShell.navigation.filter((item) => item.active).length, 1);
assert.equal(dashboardShell.qa.ok, true);
assert.equal(dashboardShell.qaPanel.visible, true);
assert.equal(dashboardShell.workspace.renderMode, 'contract-only-no-visual-mutation');

const documentsShell = createAppRuntimeShell({ activeRouteKey: 'documents' });
assert.equal(documentsShell.activeRouteKey, 'documents');
assert.equal(documentsShell.activeScreen.labelCs, 'Dokumenty');
assert.equal(documentsShell.navigation.filter((item) => item.active)[0].routeKey, 'documents');

const fallbackShell = createAppRuntimeShell({ activeRouteKey: 'missing-route' });
assert.equal(fallbackShell.activeRouteKey, 'dashboard');

const summary = getAppRuntimeShellRouteSummary(documentsShell);
assert.equal(summary.shellVersion, APP_RUNTIME_SHELL_VERSION);
assert.equal(summary.activeRouteKey, 'documents');
assert.equal(summary.navigationCount, 15);
assert.equal(summary.visualStyleLocked, true);
assert.equal(summary.renderingAllowed, false);

const validation = validateAppRuntimeShell(documentsShell);
assert.equal(validation.ok, true);
assert.equal(validation.shellVersion, APP_RUNTIME_SHELL_VERSION);
assert.equal(validation.activeRouteKey, 'documents');
assert.equal(validation.navigationCount, 15);
assert.equal(validation.errors.length, 0);

console.log('V155 FAST App Runtime Shell smoke test passed:', JSON.stringify(validation, null, 2));
