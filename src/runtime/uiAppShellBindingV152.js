// LOSKOT FVE & LPS STUDIO PRO
// V152 UI App Shell Binding
//
// This module converts the approved V151 UI foundation registry into a runtime app-shell
// view-model. It intentionally does not change any approved graphics, CSS, HTML, or screen layout.

import {
  APPROVED_UI_BASELINE,
  PRIMARY_WORKFLOW_ORDER,
  getApprovedMainScreens,
  getApprovedScreenByRoute,
  validateUiFoundationRegistry
} from './uiFoundationRegistryV151.js';

export const UI_APP_SHELL_BINDING_VERSION = 'v152-ui-app-shell-binding';

export const DEFAULT_APP_SHELL_ROUTE = 'dashboard';

export const APP_SHELL_REGIONS = Object.freeze({
  LEFT_NAVIGATION: 'left-navigation',
  CENTRAL_WORKSPACE: 'central-workspace',
  RIGHT_QA_PANEL: 'right-qa-panel',
  TOP_PROJECT_CONTEXT: 'top-project-context',
  STATUS_FOOTER: 'status-footer'
});

export function createUiNavigationItem(screen, activeRouteKey = DEFAULT_APP_SHELL_ROUTE) {
  return {
    id: screen.id,
    routeKey: screen.routeKey,
    labelCs: screen.labelCs,
    workMode: screen.workMode,
    order: screen.order,
    locked: Boolean(screen.locked),
    active: screen.routeKey === activeRouteKey,
    region: APP_SHELL_REGIONS.LEFT_NAVIGATION
  };
}

export function createUiAppShellBinding(options = {}) {
  const requestedRouteKey = options.activeRouteKey || DEFAULT_APP_SHELL_ROUTE;
  const registryValidation = validateUiFoundationRegistry();
  const screens = getApprovedMainScreens();

  const activeScreen =
    getApprovedScreenByRoute(requestedRouteKey) ||
    getApprovedScreenByRoute(DEFAULT_APP_SHELL_ROUTE) ||
    screens[0] ||
    null;

  const activeRouteKey = activeScreen ? activeScreen.routeKey : DEFAULT_APP_SHELL_ROUTE;
  const navigation = screens
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((screen) => createUiNavigationItem(screen, activeRouteKey));

  return {
    bindingVersion: UI_APP_SHELL_BINDING_VERSION,
    baselineId: APPROVED_UI_BASELINE.id,
    baselineStatus: APPROVED_UI_BASELINE.status,
    approvedStyle: APPROVED_UI_BASELINE.style,
    visualStyleLocked: true,
    activeRouteKey,
    activeScreen,
    navigation,
    workflowOrder: [...PRIMARY_WORKFLOW_ORDER],
    regions: { ...APP_SHELL_REGIONS },
    qaPanel: {
      region: APP_SHELL_REGIONS.RIGHT_QA_PANEL,
      visible: true,
      source: 'runtime-validation-and-project-state',
      statusContract: ['OK', 'WARN', 'ERROR', 'BLOCKED']
    },
    workspace: {
      region: APP_SHELL_REGIONS.CENTRAL_WORKSPACE,
      routeKey: activeRouteKey,
      screenId: activeScreen ? activeScreen.id : null,
      screenLabelCs: activeScreen ? activeScreen.labelCs : null
    },
    registryValidation
  };
}

export function getNextRouteKey(currentRouteKey) {
  const index = PRIMARY_WORKFLOW_ORDER.indexOf(currentRouteKey);
  if (index < 0) return DEFAULT_APP_SHELL_ROUTE;
  return PRIMARY_WORKFLOW_ORDER[Math.min(index + 1, PRIMARY_WORKFLOW_ORDER.length - 1)];
}

export function getPreviousRouteKey(currentRouteKey) {
  const index = PRIMARY_WORKFLOW_ORDER.indexOf(currentRouteKey);
  if (index < 0) return DEFAULT_APP_SHELL_ROUTE;
  return PRIMARY_WORKFLOW_ORDER[Math.max(index - 1, 0)];
}

export function validateUiAppShellBinding(binding = createUiAppShellBinding()) {
  const errors = [];
  const warnings = [];

  if (binding.baselineId !== 'APPROVED_UI_STYLE_BASELINE_01') {
    errors.push('App shell binding baseline mismatch.');
  }

  if (!binding.visualStyleLocked) {
    errors.push('Visual style must remain locked.');
  }

  if (!binding.registryValidation || binding.registryValidation.ok !== true) {
    errors.push('V151 registry validation is not OK.');
  }

  if (!Array.isArray(binding.navigation) || binding.navigation.length !== PRIMARY_WORKFLOW_ORDER.length) {
    errors.push('Navigation item count does not match primary workflow order.');
  }

  const activeItems = (binding.navigation || []).filter((item) => item.active);
  if (activeItems.length !== 1) {
    errors.push('Exactly one navigation item must be active.');
  }

  const navigationRoutes = (binding.navigation || []).map((item) => item.routeKey);
  if (JSON.stringify(navigationRoutes) !== JSON.stringify(PRIMARY_WORKFLOW_ORDER)) {
    errors.push('Navigation route order does not match approved workflow order.');
  }

  for (const item of binding.navigation || []) {
    if (!item.locked) {
      errors.push('Navigation item points to unlocked screen: ' + item.routeKey);
    }

    if (item.region !== APP_SHELL_REGIONS.LEFT_NAVIGATION) {
      errors.push('Navigation item has invalid region: ' + item.routeKey);
    }
  }

  if (!binding.qaPanel || binding.qaPanel.region !== APP_SHELL_REGIONS.RIGHT_QA_PANEL) {
    errors.push('QA panel contract is missing or not mapped to right QA panel.');
  }

  if (!binding.workspace || binding.workspace.region !== APP_SHELL_REGIONS.CENTRAL_WORKSPACE) {
    errors.push('Workspace contract is missing or not mapped to central workspace.');
  }

  if (binding.navigation && binding.navigation.length > 20) {
    warnings.push('Navigation has more than 20 items; review app shell density.');
  }

  return {
    ok: errors.length === 0,
    bindingVersion: binding.bindingVersion,
    baselineId: binding.baselineId,
    activeRouteKey: binding.activeRouteKey,
    navigationCount: binding.navigation ? binding.navigation.length : 0,
    errors,
    warnings
  };
}
