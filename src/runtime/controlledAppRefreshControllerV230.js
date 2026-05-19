// LOSKOT FVE & LPS STUDIO PRO
// V230 controlled-app-refresh-controller

import { createControlledAppModuleController, validateControlledAppModuleController } from './controlledAppModuleControllerV229.js';

export const CONTROLLED_APP_REFRESH_CONTROLLER_VERSION = 'v230-controlled-app-refresh-controller';

export function createControlledAppRefreshController(options = {}) {
  const previous = createControlledAppModuleController(options);
  const validation = validateControlledAppModuleController(previous);
  return {
    modelVersion: CONTROLLED_APP_REFRESH_CONTROLLER_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V230_READY' : 'BLOCKED',
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
      runtimeStep: 230,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_REFRESH_CONTROLLER_VERSION
    }
  };
}

export function validateControlledAppRefreshController(model = createControlledAppRefreshController()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_REFRESH_CONTROLLER_VERSION) errors.push('Unexpected V230 version.');
  if (model.visualMutationAllowed !== false) errors.push('V230 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V230 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V230 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V230 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V230 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V230 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
