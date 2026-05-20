// LOSKOT FVE & LPS STUDIO PRO
// V231 controlled-app-command-bus

import { createControlledAppRefreshController, validateControlledAppRefreshController } from './controlledAppRefreshControllerV230.js';

export const CONTROLLED_APP_COMMAND_BUS_VERSION = 'v231-controlled-app-command-bus';

export function createControlledAppCommandBus(options = {}) {
  const previous = createControlledAppRefreshController(options);
  const validation = validateControlledAppRefreshController(previous);
  return {
    modelVersion: CONTROLLED_APP_COMMAND_BUS_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V231_READY' : 'BLOCKED',
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
      runtimeStep: 231,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_COMMAND_BUS_VERSION
    }
  };
}

export function validateControlledAppCommandBus(model = createControlledAppCommandBus()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_COMMAND_BUS_VERSION) errors.push('Unexpected V231 version.');
  if (model.visualMutationAllowed !== false) errors.push('V231 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V231 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V231 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V231 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V231 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V231 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
