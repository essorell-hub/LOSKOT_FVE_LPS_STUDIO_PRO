// LOSKOT FVE & LPS STUDIO PRO
// V194 App Shell Left Menu Runtime Model

import { createAppShellModuleRuntimeMap, validateAppShellModuleRuntimeMap } from './appShellModuleRuntimeMapV193.js';

export const APP_SHELL_LEFT_MENU_RUNTIME_MODEL_VERSION = 'v194-app-shell-left-menu-runtime-model';

export function createAppShellLeftMenuRuntimeModel(options = {}) {
  const modules = createAppShellModuleRuntimeMap(options);
  const validation = validateAppShellModuleRuntimeMap(modules);
  const leftMenu = modules.moduleMap.map((module, index) => ({
    order: index + 1,
    moduleId: module.moduleId,
    label: module.moduleId,
    enabled: module.ready,
    readOnly: true
  }));
  return {
    modelVersion: APP_SHELL_LEFT_MENU_RUNTIME_MODEL_VERSION,
    ready: validation.ok,
    visualMutationAllowed: false,
    leftMenu,
    modules,
    qa: { ok: validation.ok && leftMenu.length === 13, itemCount: leftMenu.length, errors: validation.errors }
  };
}

export function validateAppShellLeftMenuRuntimeModel(model = createAppShellLeftMenuRuntimeModel()) {
  const errors = [];
  if (model.modelVersion !== APP_SHELL_LEFT_MENU_RUNTIME_MODEL_VERSION) errors.push('Unexpected V194 version.');
  if (model.visualMutationAllowed !== false) errors.push('V194 must not mutate visuals.');
  if (!Array.isArray(model.leftMenu) || model.leftMenu.length !== 13) errors.push('V194 left menu item count must be 13.');
  if (!model.qa || model.qa.ok !== true) errors.push('V194 QA is not OK.');
  return { ok: errors.length === 0, version: model.modelVersion, itemCount: model.leftMenu?.length || 0, errors };
}
