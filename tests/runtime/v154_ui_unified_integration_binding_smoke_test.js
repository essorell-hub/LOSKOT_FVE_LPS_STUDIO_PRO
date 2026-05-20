import assert from 'node:assert/strict';
import {
  UI_UNIFIED_INTEGRATION_BINDING_VERSION,
  UI_UNIFIED_INTEGRATION_STATUS,
  createUiUnifiedIntegrationBinding,
  createUiUnifiedIntegrationStartupPlan,
  inspectUnifiedAppIntegrationModule,
  validateUiUnifiedIntegrationBinding
} from '../../src/runtime/uiUnifiedIntegrationBindingV154.js';

console.log('Starting V154 UI Unified Integration Binding smoke test...');

const inspection = inspectUnifiedAppIntegrationModule();
assert.equal(inspection.modulePresent, true);
assert.equal(typeof inspection.exportCount, 'number');
assert.ok(Array.isArray(inspection.exportNames));

const dashboardBinding = createUiUnifiedIntegrationBinding({ activeRouteKey: 'dashboard' });
assert.equal(dashboardBinding.bindingVersion, UI_UNIFIED_INTEGRATION_BINDING_VERSION);
assert.equal(dashboardBinding.status, UI_UNIFIED_INTEGRATION_STATUS.READY);
assert.equal(dashboardBinding.visualStyleLocked, true);
assert.equal(dashboardBinding.activeRouteKey, 'dashboard');
assert.equal(dashboardBinding.activeScreenId, 'APPROVED_SCREEN_DASHBOARD_01_VARIANT_A');
assert.equal(dashboardBinding.qa.ok, true);
assert.equal(dashboardBinding.qa.bootstrapOk, true);
assert.equal(dashboardBinding.qa.unifiedIntegrationPresent, true);
assert.equal(dashboardBinding.appRuntimeComposition.allowedToRenderVisuals, false);
assert.equal(dashboardBinding.appRuntimeComposition.approvedUiBaselineLocked, true);

const documentsBinding = createUiUnifiedIntegrationBinding({ activeRouteKey: 'documents' });
assert.equal(documentsBinding.activeRouteKey, 'documents');
assert.equal(documentsBinding.activeScreenLabelCs, 'Dokumenty');

const fallbackBinding = createUiUnifiedIntegrationBinding({ activeRouteKey: 'missing-route' });
assert.equal(fallbackBinding.activeRouteKey, 'dashboard');

const startupPlan = createUiUnifiedIntegrationStartupPlan({ activeRouteKey: 'documents' });
assert.equal(startupPlan.status, UI_UNIFIED_INTEGRATION_STATUS.READY);
assert.equal(startupPlan.activeRouteKey, 'documents');
assert.equal(startupPlan.steps.length, 6);
assert.equal(startupPlan.steps.every((step) => step.ok === true), true);

const validation = validateUiUnifiedIntegrationBinding(documentsBinding);
assert.equal(validation.ok, true);
assert.equal(validation.bindingVersion, UI_UNIFIED_INTEGRATION_BINDING_VERSION);
assert.equal(validation.activeRouteKey, 'documents');
assert.equal(validation.errors.length, 0);

console.log('V154 UI Unified Integration Binding smoke test passed:', JSON.stringify(validation, null, 2));
