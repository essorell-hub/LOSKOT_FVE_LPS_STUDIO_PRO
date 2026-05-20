import assert from 'node:assert/strict';
import {
  APP_SHELL_REGIONS,
  DEFAULT_APP_SHELL_ROUTE,
  UI_APP_SHELL_BINDING_VERSION,
  createUiAppShellBinding,
  getNextRouteKey,
  getPreviousRouteKey,
  validateUiAppShellBinding
} from '../../src/runtime/uiAppShellBindingV152.js';

console.log('Starting V152 UI App Shell Binding smoke test...');

const defaultBinding = createUiAppShellBinding();
assert.equal(defaultBinding.bindingVersion, UI_APP_SHELL_BINDING_VERSION);
assert.equal(defaultBinding.baselineId, 'APPROVED_UI_STYLE_BASELINE_01');
assert.equal(defaultBinding.baselineStatus, 'LOCKED_APPROVED');
assert.equal(defaultBinding.visualStyleLocked, true);
assert.equal(defaultBinding.activeRouteKey, DEFAULT_APP_SHELL_ROUTE);
assert.equal(defaultBinding.navigation.length, 15);
assert.equal(defaultBinding.navigation.filter((item) => item.active).length, 1);
assert.equal(defaultBinding.qaPanel.region, APP_SHELL_REGIONS.RIGHT_QA_PANEL);
assert.equal(defaultBinding.workspace.region, APP_SHELL_REGIONS.CENTRAL_WORKSPACE);

const documentsBinding = createUiAppShellBinding({ activeRouteKey: 'documents' });
assert.equal(documentsBinding.activeRouteKey, 'documents');
assert.equal(documentsBinding.workspace.routeKey, 'documents');
assert.equal(documentsBinding.navigation.filter((item) => item.active)[0].routeKey, 'documents');

const fallbackBinding = createUiAppShellBinding({ activeRouteKey: 'missing-route' });
assert.equal(fallbackBinding.activeRouteKey, DEFAULT_APP_SHELL_ROUTE);

assert.equal(getNextRouteKey('dashboard'), 'project-card');
assert.equal(getNextRouteKey('settings'), 'settings');
assert.equal(getPreviousRouteKey('project-card'), 'dashboard');
assert.equal(getPreviousRouteKey('dashboard'), 'dashboard');
assert.equal(getNextRouteKey('missing-route'), DEFAULT_APP_SHELL_ROUTE);
assert.equal(getPreviousRouteKey('missing-route'), DEFAULT_APP_SHELL_ROUTE);

const validation = validateUiAppShellBinding(documentsBinding);
assert.equal(validation.ok, true);
assert.equal(validation.navigationCount, 15);
assert.equal(validation.errors.length, 0);

console.log('V152 UI App Shell Binding smoke test passed:', JSON.stringify(validation, null, 2));
