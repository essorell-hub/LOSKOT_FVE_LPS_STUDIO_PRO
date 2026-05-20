// LOSKOT FVE & LPS STUDIO PRO
// V229 controlled-app-module-controller

import { createControlledAppRouteController, validateControlledAppRouteController } from './controlledAppRouteControllerV228.js';

export const CONTROLLED_APP_MODULE_CONTROLLER_VERSION = 'v229-controlled-app-module-controller';

export function createControlledAppModuleController(options = {}) {
  const previous = createControlledAppRouteController(options);
  const validation = validateControlledAppRouteController(previous);
  return {
    modelVersion: CONTROLLED_APP_MODULE_CONTROLLER_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V229_READY' : 'BLOCKED',
    visualMutationAllowed: false,
    controls: {
      readOnly: true,
      canWriteUi: false,
      canMutateVisuals: false,
      canPush: false,
      canMerge: false,
      canChangePackage: false
    },
    metrics: {
      runtimeStep: 229,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_MODULE_CONTROLLER_VERSION
    }
  };
}

export function validateControlledAppModuleController(model = createControlledAppModuleController()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_MODULE_CONTROLLER_VERSION) errors.push('Unexpected V229 version.');
  if (model.visualMutationAllowed !== false) errors.push('V229 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V229 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V229 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V229 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V229 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V229 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
