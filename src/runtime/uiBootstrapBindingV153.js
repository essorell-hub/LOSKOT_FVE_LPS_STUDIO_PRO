// LOSKOT FVE & LPS STUDIO PRO
// V153 UI Bootstrap Binding
//
// Additive bridge between V152 UI app-shell binding and existing runtimeBootstrap module.
// It does not change approved graphics, CSS, HTML, images, JSX/TSX, or locked screen layouts.

import * as runtimeBootstrapModule from './runtimeBootstrap.js';
import {
  DEFAULT_APP_SHELL_ROUTE,
  UI_APP_SHELL_BINDING_VERSION,
  createUiAppShellBinding,
  getNextRouteKey,
  getPreviousRouteKey,
  validateUiAppShellBinding
} from './uiAppShellBindingV152.js';

export const UI_BOOTSTRAP_BINDING_VERSION = 'v153-ui-bootstrap-binding';

export const UI_BOOTSTRAP_BINDING_STATUS = Object.freeze({
  READY: 'READY',
  DEGRADED: 'DEGRADED',
  BLOCKED: 'BLOCKED'
});

export function inspectRuntimeBootstrapModule(moduleNamespace = runtimeBootstrapModule) {
  const exportNames = Object.keys(moduleNamespace || {}).sort();
  const likelyBootstrapExports = exportNames.filter((name) =>
    /bootstrap|runtime|init|create|start/i.test(name)
  );

  return {
    modulePresent: Boolean(moduleNamespace),
    exportCount: exportNames.length,
    exportNames,
    likelyBootstrapExports,
    hasLikelyBootstrapExport: likelyBootstrapExports.length > 0
  };
}

export function createUiBootstrapBinding(options = {}) {
  const activeRouteKey = options.activeRouteKey || DEFAULT_APP_SHELL_ROUTE;
  const appShell = createUiAppShellBinding({ activeRouteKey });
  const appShellValidation = validateUiAppShellBinding(appShell);
  const runtimeBootstrap = inspectRuntimeBootstrapModule(options.runtimeBootstrapModule || runtimeBootstrapModule);

  const errors = [];
  const warnings = [];

  if (!appShellValidation.ok) {
    errors.push('V152 app-shell binding is not valid.');
  }

  if (!runtimeBootstrap.modulePresent) {
    errors.push('runtimeBootstrap module is not available.');
  }

  if (runtimeBootstrap.exportCount === 0) {
    warnings.push('runtimeBootstrap module has no named exports. Adapter remains metadata-only.');
  }

  return {
    bindingVersion: UI_BOOTSTRAP_BINDING_VERSION,
    appShellBindingVersion: UI_APP_SHELL_BINDING_VERSION,
    status: errors.length === 0 ? UI_BOOTSTRAP_BINDING_STATUS.READY : UI_BOOTSTRAP_BINDING_STATUS.BLOCKED,
    visualStyleLocked: true,
    activeRouteKey: appShell.activeRouteKey,
    activeScreenId: appShell.activeScreen ? appShell.activeScreen.id : null,
    activeScreenLabelCs: appShell.activeScreen ? appShell.activeScreen.labelCs : null,
    nextRouteKey: getNextRouteKey(appShell.activeRouteKey),
    previousRouteKey: getPreviousRouteKey(appShell.activeRouteKey),
    appShell,
    runtimeBootstrap,
    qa: {
      ok: errors.length === 0,
      appShellOk: appShellValidation.ok,
      runtimeBootstrapPresent: runtimeBootstrap.modulePresent,
      runtimeBootstrapExportCount: runtimeBootstrap.exportCount,
      visualStyleLocked: true,
      errors,
      warnings
    }
  };
}

export function createUiBootstrapStartupPlan(options = {}) {
  const binding = createUiBootstrapBinding(options);

  return {
    planVersion: UI_BOOTSTRAP_BINDING_VERSION + '-startup-plan',
    status: binding.status,
    activeRouteKey: binding.activeRouteKey,
    steps: [
      {
        order: 10,
        key: 'validate-ui-foundation',
        labelCs: 'Ověřit schválený UI foundation registry',
        ok: binding.appShell.registryValidation.ok
      },
      {
        order: 20,
        key: 'create-app-shell-binding',
        labelCs: 'Vytvořit app-shell binding z V152',
        ok: binding.qa.appShellOk
      },
      {
        order: 30,
        key: 'attach-runtime-bootstrap',
        labelCs: 'Připojit metadata existujícího runtime bootstrapu',
        ok: binding.qa.runtimeBootstrapPresent
      },
      {
        order: 40,
        key: 'preserve-visual-baseline',
        labelCs: 'Zachovat zamčenou Classic PRO grafiku',
        ok: binding.qa.visualStyleLocked
      },
      {
        order: 50,
        key: 'prepare-navigation-state',
        labelCs: 'Připravit aktivní obrazovku a navigaci',
        ok: Boolean(binding.activeRouteKey && binding.activeScreenId)
      }
    ],
    errors: [...binding.qa.errors],
    warnings: [...binding.qa.warnings]
  };
}

export function validateUiBootstrapBinding(binding = createUiBootstrapBinding()) {
  const errors = [];
  const warnings = [];

  if (binding.bindingVersion !== UI_BOOTSTRAP_BINDING_VERSION) {
    errors.push('Unexpected V153 binding version.');
  }

  if (binding.appShellBindingVersion !== UI_APP_SHELL_BINDING_VERSION) {
    errors.push('Unexpected V152 app-shell binding version.');
  }

  if (!binding.visualStyleLocked) {
    errors.push('Visual style must remain locked.');
  }

  if (!binding.appShell || !binding.appShell.registryValidation || binding.appShell.registryValidation.ok !== true) {
    errors.push('App-shell registry validation is not OK.');
  }

  if (!binding.runtimeBootstrap || binding.runtimeBootstrap.modulePresent !== true) {
    errors.push('runtimeBootstrap metadata is missing.');
  }

  if (!binding.activeRouteKey || !binding.activeScreenId) {
    errors.push('Active route or active screen is missing.');
  }

  if (binding.runtimeBootstrap && binding.runtimeBootstrap.exportCount === 0) {
    warnings.push('runtimeBootstrap has no named exports; bridge is metadata-only for now.');
  }

  return {
    ok: errors.length === 0,
    bindingVersion: binding.bindingVersion,
    status: binding.status,
    activeRouteKey: binding.activeRouteKey,
    activeScreenId: binding.activeScreenId,
    runtimeBootstrapExportCount: binding.runtimeBootstrap ? binding.runtimeBootstrap.exportCount : 0,
    errors,
    warnings
  };
}
