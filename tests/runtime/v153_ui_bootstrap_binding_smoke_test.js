import assert from 'node:assert/strict';
import {
  UI_BOOTSTRAP_BINDING_STATUS,
  UI_BOOTSTRAP_BINDING_VERSION,
  createUiBootstrapBinding,
  createUiBootstrapStartupPlan,
  inspectRuntimeBootstrapModule,
  validateUiBootstrapBinding
} from '../../src/runtime/uiBootstrapBindingV153.js';

console.log('Starting V153 UI Bootstrap Binding smoke test...');

const inspection = inspectRuntimeBootstrapModule();
assert.equal(inspection.modulePresent, true);
assert.equal(typeof inspection.exportCount, 'number');
assert.ok(Array.isArray(inspection.exportNames));

const dashboardBinding = createUiBootstrapBinding({ activeRouteKey: 'dashboard' });
assert.equal(dashboardBinding.bindingVersion, UI_BOOTSTRAP_BINDING_VERSION);
assert.equal(dashboardBinding.status, UI_BOOTSTRAP_BINDING_STATUS.READY);
assert.equal(dashboardBinding.visualStyleLocked, true);
assert.equal(dashboardBinding.activeRouteKey, 'dashboard');
assert.equal(dashboardBinding.activeScreenId, 'APPROVED_SCREEN_DASHBOARD_01_VARIANT_A');
assert.equal(dashboardBinding.nextRouteKey, 'project-card');
assert.equal(dashboardBinding.previousRouteKey, 'dashboard');
assert.equal(dashboardBinding.qa.ok, true);
assert.equal(dashboardBinding.qa.appShellOk, true);
assert.equal(dashboardBinding.qa.runtimeBootstrapPresent, true);

const documentsBinding = createUiBootstrapBinding({ activeRouteKey: 'documents' });
assert.equal(documentsBinding.activeRouteKey, 'documents');
assert.equal(documentsBinding.activeScreenLabelCs, 'Dokumenty');
assert.equal(documentsBinding.nextRouteKey, 'database');
assert.equal(documentsBinding.previousRouteKey, 'reports-statements');

const fallbackBinding = createUiBootstrapBinding({ activeRouteKey: 'missing-route' });
assert.equal(fallbackBinding.activeRouteKey, 'dashboard');

const startupPlan = createUiBootstrapStartupPlan({ activeRouteKey: 'documents' });
assert.equal(startupPlan.status, UI_BOOTSTRAP_BINDING_STATUS.READY);
assert.equal(startupPlan.activeRouteKey, 'documents');
assert.equal(startupPlan.steps.length, 5);
assert.equal(startupPlan.steps.every((step) => step.ok === true), true);

const validation = validateUiBootstrapBinding(documentsBinding);
assert.equal(validation.ok, true);
assert.equal(validation.bindingVersion, UI_BOOTSTRAP_BINDING_VERSION);
assert.equal(validation.activeRouteKey, 'documents');
assert.equal(validation.errors.length, 0);

console.log('V153 UI Bootstrap Binding smoke test passed:', JSON.stringify(validation, null, 2));
