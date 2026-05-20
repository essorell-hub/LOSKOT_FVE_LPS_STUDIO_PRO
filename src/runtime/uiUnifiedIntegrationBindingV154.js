// LOSKOT FVE & LPS STUDIO PRO
// V154 UI Unified Integration Binding
//
// Additive adapter connecting V153 UI bootstrap binding to existing unifiedAppIntegration module.
// This module is deliberately metadata/runtime-only and does not modify any approved visuals.

import * as unifiedAppIntegrationModule from './unifiedAppIntegration.js';
import {
  UI_BOOTSTRAP_BINDING_VERSION,
  createUiBootstrapBinding,
  createUiBootstrapStartupPlan,
  validateUiBootstrapBinding
} from './uiBootstrapBindingV153.js';

export const UI_UNIFIED_INTEGRATION_BINDING_VERSION = 'v154-ui-unified-integration-binding';

export const UI_UNIFIED_INTEGRATION_STATUS = Object.freeze({
  READY: 'READY',
  DEGRADED: 'DEGRADED',
  BLOCKED: 'BLOCKED'
});

export function inspectUnifiedAppIntegrationModule(moduleNamespace = unifiedAppIntegrationModule) {
  const exportNames = Object.keys(moduleNamespace || {}).sort();
  const likelyIntegrationExports = exportNames.filter((name) =>
    /integration|unified|app|runtime|create|build|validate/i.test(name)
  );

  return {
    modulePresent: Boolean(moduleNamespace),
    exportCount: exportNames.length,
    exportNames,
    likelyIntegrationExports,
    hasLikelyIntegrationExport: likelyIntegrationExports.length > 0
  };
}

export function createUiUnifiedIntegrationBinding(options = {}) {
  const bootstrapBinding = createUiBootstrapBinding({ activeRouteKey: options.activeRouteKey });
  const bootstrapValidation = validateUiBootstrapBinding(bootstrapBinding);
  const startupPlan = createUiBootstrapStartupPlan({ activeRouteKey: bootstrapBinding.activeRouteKey });
  const unifiedIntegration = inspectUnifiedAppIntegrationModule(
    options.unifiedAppIntegrationModule || unifiedAppIntegrationModule
  );

  const errors = [];
  const warnings = [];

  if (!bootstrapValidation.ok) {
    errors.push('V153 UI bootstrap binding validation is not OK.');
  }

  if (!unifiedIntegration.modulePresent) {
    errors.push('unifiedAppIntegration module is not available.');
  }

  if (unifiedIntegration.exportCount === 0) {
    warnings.push('unifiedAppIntegration module has no named exports. Adapter remains metadata-only.');
  }

  return {
    bindingVersion: UI_UNIFIED_INTEGRATION_BINDING_VERSION,
    bootstrapBindingVersion: UI_BOOTSTRAP_BINDING_VERSION,
    status: errors.length === 0 ? UI_UNIFIED_INTEGRATION_STATUS.READY : UI_UNIFIED_INTEGRATION_STATUS.BLOCKED,
    visualStyleLocked: true,
    activeRouteKey: bootstrapBinding.activeRouteKey,
    activeScreenId: bootstrapBinding.activeScreenId,
    activeScreenLabelCs: bootstrapBinding.activeScreenLabelCs,
    bootstrapBinding,
    startupPlan,
    unifiedIntegration,
    appRuntimeComposition: {
      mode: 'metadata-bridge',
      source: 'V153 UI bootstrap binding + existing unifiedAppIntegration module',
      allowedToRenderVisuals: false,
      approvedUiBaselineLocked: true,
      nextSafeStep: 'controlled shell composition without visual redesign'
    },
    qa: {
      ok: errors.length === 0,
      bootstrapOk: bootstrapValidation.ok,
      unifiedIntegrationPresent: unifiedIntegration.modulePresent,
      unifiedIntegrationExportCount: unifiedIntegration.exportCount,
      visualStyleLocked: true,
      errors,
      warnings
    }
  };
}

export function createUiUnifiedIntegrationStartupPlan(options = {}) {
  const binding = createUiUnifiedIntegrationBinding(options);

  return {
    planVersion: UI_UNIFIED_INTEGRATION_BINDING_VERSION + '-startup-plan',
    status: binding.status,
    activeRouteKey: binding.activeRouteKey,
    steps: [
      {
        order: 10,
        key: 'load-v151-registry',
        labelCs: 'Načíst schválený UI registry V151',
        ok: binding.bootstrapBinding.appShell.registryValidation.ok
      },
      {
        order: 20,
        key: 'load-v152-app-shell',
        labelCs: 'Načíst app-shell binding V152',
        ok: binding.bootstrapBinding.qa.appShellOk
      },
      {
        order: 30,
        key: 'load-v153-bootstrap-binding',
        labelCs: 'Načíst bootstrap binding V153',
        ok: binding.qa.bootstrapOk
      },
      {
        order: 40,
        key: 'attach-unified-integration',
        labelCs: 'Připojit unified app integration vrstvu',
        ok: binding.qa.unifiedIntegrationPresent
      },
      {
        order: 50,
        key: 'preserve-approved-ui',
        labelCs: 'Zachovat schválený Classic PRO vzhled',
        ok: binding.qa.visualStyleLocked
      },
      {
        order: 60,
        key: 'prepare-runtime-composition',
        labelCs: 'Připravit runtime kompozici bez vizuálního redesignu',
        ok: binding.appRuntimeComposition.allowedToRenderVisuals === false
      }
    ],
    errors: [...binding.qa.errors],
    warnings: [...binding.qa.warnings]
  };
}

export function validateUiUnifiedIntegrationBinding(binding = createUiUnifiedIntegrationBinding()) {
  const errors = [];
  const warnings = [];

  if (binding.bindingVersion !== UI_UNIFIED_INTEGRATION_BINDING_VERSION) {
    errors.push('Unexpected V154 binding version.');
  }

  if (binding.bootstrapBindingVersion !== UI_BOOTSTRAP_BINDING_VERSION) {
    errors.push('Unexpected V153 bootstrap binding version.');
  }

  if (!binding.visualStyleLocked) {
    errors.push('Visual style must remain locked.');
  }

  if (!binding.bootstrapBinding || !binding.bootstrapBinding.qa || binding.bootstrapBinding.qa.ok !== true) {
    errors.push('Bootstrap binding QA is not OK.');
  }

  if (!binding.unifiedIntegration || binding.unifiedIntegration.modulePresent !== true) {
    errors.push('unifiedAppIntegration metadata is missing.');
  }

  if (!binding.activeRouteKey || !binding.activeScreenId) {
    errors.push('Active route or active screen is missing.');
  }

  if (!binding.appRuntimeComposition || binding.appRuntimeComposition.allowedToRenderVisuals !== false) {
    errors.push('V154 adapter must not render or alter visuals.');
  }

  if (binding.unifiedIntegration && binding.unifiedIntegration.exportCount === 0) {
    warnings.push('unifiedAppIntegration has no named exports; bridge is metadata-only for now.');
  }

  return {
    ok: errors.length === 0,
    bindingVersion: binding.bindingVersion,
    status: binding.status,
    activeRouteKey: binding.activeRouteKey,
    activeScreenId: binding.activeScreenId,
    unifiedIntegrationExportCount: binding.unifiedIntegration ? binding.unifiedIntegration.exportCount : 0,
    errors,
    warnings
  };
}
