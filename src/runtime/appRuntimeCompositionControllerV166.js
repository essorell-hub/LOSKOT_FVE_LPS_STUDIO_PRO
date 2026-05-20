// LOSKOT FVE & LPS STUDIO PRO
// V166 App Runtime Composition Controller

import {
  APP_READINESS_MODEL_VERSION,
  createAppReadinessModel,
  validateAppReadinessModel
} from './appReadinessModelV165.js';

export const APP_RUNTIME_COMPOSITION_CONTROLLER_VERSION = 'v166-app-runtime-composition-controller';

export function createAppRuntimeCompositionController(options = {}) {
  const readiness = createAppReadinessModel({
    activeRouteKey: options.activeRouteKey,
    projectContext: options.projectContext
  });
  const readinessValidation = validateAppReadinessModel(readiness);

  const composition = {
    leftNavigation: true,
    centralWorkspace: true,
    rightQaPanel: true,
    projectContextHeader: true,
    statusFooter: true,
    visualMutationAllowed: false,
    renderMode: 'readiness-contract-only'
  };

  return {
    controllerVersion: APP_RUNTIME_COMPOSITION_CONTROLLER_VERSION,
    readinessVersion: APP_READINESS_MODEL_VERSION,
    ready: readinessValidation.ok,
    visualMutationAllowed: false,
    activeRouteKey: readiness.manifest.bridge.activeRouteKey,
    status: readiness.status,
    composition,
    readiness,
    qa: {
      ok: readinessValidation.ok,
      readinessOk: readinessValidation.ok,
      compositionRegionCount: Object.keys(composition).filter((key) => composition[key] === true).length,
      errors: readinessValidation.errors
    }
  };
}

export function validateAppRuntimeCompositionController(controller = createAppRuntimeCompositionController()) {
  const errors = [];
  if (controller.controllerVersion !== APP_RUNTIME_COMPOSITION_CONTROLLER_VERSION) errors.push('Unexpected V166 controller version.');
  if (controller.readinessVersion !== APP_READINESS_MODEL_VERSION) errors.push('Unexpected V165 readiness version.');
  if (controller.visualMutationAllowed !== false) errors.push('Composition controller must not allow visual mutation.');
  if (!controller.composition || controller.composition.visualMutationAllowed !== false) errors.push('Composition contract must block visual mutation.');
  if (!controller.qa || controller.qa.ok !== true) errors.push('Composition controller QA is not OK.');
  return { ok: errors.length === 0, controllerVersion: controller.controllerVersion, status: controller.status, activeRouteKey: controller.activeRouteKey, errors };
}
