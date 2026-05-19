// LOSKOT FVE & LPS STUDIO PRO
// V167 Read-Only Shell Binding

import {
  APP_RUNTIME_COMPOSITION_CONTROLLER_VERSION,
  createAppRuntimeCompositionController,
  validateAppRuntimeCompositionController
} from './appRuntimeCompositionControllerV166.js';

export const READ_ONLY_SHELL_BINDING_VERSION = 'v167-read-only-shell-binding';

export function createReadOnlyShellBinding(options = {}) {
  const controller = createAppRuntimeCompositionController({
    activeRouteKey: options.activeRouteKey,
    projectContext: options.projectContext
  });
  const controllerValidation = validateAppRuntimeCompositionController(controller);

  return {
    bindingVersion: READ_ONLY_SHELL_BINDING_VERSION,
    controllerVersion: APP_RUNTIME_COMPOSITION_CONTROLLER_VERSION,
    ready: controllerValidation.ok,
    visualMutationAllowed: false,
    writeToUiAllowed: false,
    readOnlyDataAllowed: true,
    activeRouteKey: controller.activeRouteKey,
    shellBindingContract: {
      bindNavigationData: true,
      bindWorkspaceData: true,
      bindQaPanelData: true,
      bindProjectContextData: true,
      modifyLayout: false,
      modifyCss: false,
      modifyComponents: false
    },
    controller,
    qa: {
      ok: controllerValidation.ok,
      controllerOk: controllerValidation.ok,
      readOnly: true,
      errors: controllerValidation.errors
    }
  };
}

export function validateReadOnlyShellBinding(binding = createReadOnlyShellBinding()) {
  const errors = [];
  if (binding.bindingVersion !== READ_ONLY_SHELL_BINDING_VERSION) errors.push('Unexpected V167 binding version.');
  if (binding.controllerVersion !== APP_RUNTIME_COMPOSITION_CONTROLLER_VERSION) errors.push('Unexpected V166 controller version.');
  if (binding.visualMutationAllowed !== false) errors.push('Read-only shell binding must not allow visual mutation.');
  if (binding.writeToUiAllowed !== false) errors.push('Read-only shell binding must not write to UI.');
  if (!binding.shellBindingContract || binding.shellBindingContract.modifyCss !== false || binding.shellBindingContract.modifyComponents !== false) errors.push('Read-only shell contract is unsafe.');
  if (!binding.qa || binding.qa.ok !== true) errors.push('Read-only shell QA is not OK.');
  return { ok: errors.length === 0, bindingVersion: binding.bindingVersion, activeRouteKey: binding.activeRouteKey, errors };
}
