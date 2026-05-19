// LOSKOT FVE & LPS STUDIO PRO
// V155 FAST App Runtime Shell
//
// Runtime view-model shell built from V154 unified integration binding.
// This module does not render or alter visuals. It only prepares application state contracts.

import {
  UI_UNIFIED_INTEGRATION_BINDING_VERSION,
  createUiUnifiedIntegrationBinding,
  createUiUnifiedIntegrationStartupPlan,
  validateUiUnifiedIntegrationBinding
} from './uiUnifiedIntegrationBindingV154.js';

export const APP_RUNTIME_SHELL_VERSION = 'v155-fast-app-runtime-shell';

export const APP_RUNTIME_SHELL_STATUS = Object.freeze({
  READY: 'READY',
  DEGRADED: 'DEGRADED',
  BLOCKED: 'BLOCKED'
});

export const APP_RUNTIME_SHELL_REGIONS = Object.freeze({
  LEFT_NAVIGATION: 'left-navigation',
  CENTRAL_WORKSPACE: 'central-workspace',
  RIGHT_QA_PANEL: 'right-qa-panel',
  TOP_PROJECT_CONTEXT: 'top-project-context',
  STATUS_FOOTER: 'status-footer'
});

export function createAppRuntimeShell(options = {}) {
  const integrationBinding = createUiUnifiedIntegrationBinding({
    activeRouteKey: options.activeRouteKey
  });
  const integrationValidation = validateUiUnifiedIntegrationBinding(integrationBinding);
  const startupPlan = createUiUnifiedIntegrationStartupPlan({
    activeRouteKey: integrationBinding.activeRouteKey
  });

  const errors = [];
  const warnings = [];

  if (!integrationValidation.ok) {
    errors.push('V154 unified integration binding is not valid.');
  }

  if (!integrationBinding.visualStyleLocked) {
    errors.push('Approved visual style is not locked.');
  }

  const navigation = integrationBinding.bootstrapBinding.appShell.navigation.map((item) => ({
    routeKey: item.routeKey,
    labelCs: item.labelCs,
    active: item.routeKey === integrationBinding.activeRouteKey,
    locked: item.locked,
    order: item.order
  }));

  return {
    shellVersion: APP_RUNTIME_SHELL_VERSION,
    integrationBindingVersion: UI_UNIFIED_INTEGRATION_BINDING_VERSION,
    status: errors.length === 0 ? APP_RUNTIME_SHELL_STATUS.READY : APP_RUNTIME_SHELL_STATUS.BLOCKED,
    visualStyleLocked: true,
    renderingAllowed: false,
    activeRouteKey: integrationBinding.activeRouteKey,
    activeScreen: {
      id: integrationBinding.activeScreenId,
      labelCs: integrationBinding.activeScreenLabelCs
    },
    regions: { ...APP_RUNTIME_SHELL_REGIONS },
    navigation,
    workspace: {
      region: APP_RUNTIME_SHELL_REGIONS.CENTRAL_WORKSPACE,
      routeKey: integrationBinding.activeRouteKey,
      screenId: integrationBinding.activeScreenId,
      labelCs: integrationBinding.activeScreenLabelCs,
      renderMode: 'contract-only-no-visual-mutation'
    },
    qaPanel: {
      region: APP_RUNTIME_SHELL_REGIONS.RIGHT_QA_PANEL,
      visible: true,
      ok: errors.length === 0,
      source: 'V155 runtime shell + V154 integration binding',
      checks: [
        'approved-ui-registry',
        'app-shell-binding',
        'bootstrap-binding',
        'unified-integration-binding',
        'visual-lock'
      ]
    },
    startupPlan,
    integrationBinding,
    qa: {
      ok: errors.length === 0,
      integrationOk: integrationValidation.ok,
      visualStyleLocked: true,
      renderingAllowed: false,
      navigationCount: navigation.length,
      errors,
      warnings
    }
  };
}

export function getAppRuntimeShellRouteSummary(shell = createAppRuntimeShell()) {
  return {
    shellVersion: shell.shellVersion,
    status: shell.status,
    activeRouteKey: shell.activeRouteKey,
    activeScreenId: shell.activeScreen.id,
    activeScreenLabelCs: shell.activeScreen.labelCs,
    navigationCount: shell.navigation.length,
    qaOk: shell.qa.ok,
    visualStyleLocked: shell.visualStyleLocked,
    renderingAllowed: shell.renderingAllowed
  };
}

export function validateAppRuntimeShell(shell = createAppRuntimeShell()) {
  const errors = [];
  const warnings = [];

  if (shell.shellVersion !== APP_RUNTIME_SHELL_VERSION) {
    errors.push('Unexpected V155 shell version.');
  }

  if (shell.integrationBindingVersion !== UI_UNIFIED_INTEGRATION_BINDING_VERSION) {
    errors.push('Unexpected V154 integration binding version.');
  }

  if (shell.visualStyleLocked !== true) {
    errors.push('Visual style must remain locked.');
  }

  if (shell.renderingAllowed !== false) {
    errors.push('V155 shell must not render or alter visual UI.');
  }

  if (!shell.activeRouteKey || !shell.activeScreen || !shell.activeScreen.id) {
    errors.push('Active route or screen is missing.');
  }

  if (!Array.isArray(shell.navigation) || shell.navigation.length !== 15) {
    errors.push('Navigation must contain 15 approved screens.');
  }

  const activeItems = Array.isArray(shell.navigation)
    ? shell.navigation.filter((item) => item.active)
    : [];

  if (activeItems.length !== 1) {
    errors.push('Exactly one navigation item must be active.');
  }

  if (!shell.workspace || shell.workspace.region !== APP_RUNTIME_SHELL_REGIONS.CENTRAL_WORKSPACE) {
    errors.push('Workspace region is invalid.');
  }

  if (!shell.qaPanel || shell.qaPanel.region !== APP_RUNTIME_SHELL_REGIONS.RIGHT_QA_PANEL) {
    errors.push('QA panel region is invalid.');
  }

  if (shell.integrationBinding && shell.integrationBinding.qa && shell.integrationBinding.qa.warnings) {
    warnings.push(...shell.integrationBinding.qa.warnings);
  }

  return {
    ok: errors.length === 0,
    shellVersion: shell.shellVersion,
    status: shell.status,
    activeRouteKey: shell.activeRouteKey,
    activeScreenId: shell.activeScreen ? shell.activeScreen.id : null,
    navigationCount: shell.navigation ? shell.navigation.length : 0,
    errors,
    warnings
  };
}
