// LOSKOT FVE & LPS STUDIO PRO
// V228 controlled-app-route-controller

import { createControlledAppStatusAdapter, validateControlledAppStatusAdapter } from './controlledAppStatusAdapterV227.js';

export const CONTROLLED_APP_ROUTE_CONTROLLER_VERSION = 'v228-controlled-app-route-controller';

export function createControlledAppRouteController(options = {}) {
  const previous = createControlledAppStatusAdapter(options);
  const validation = validateControlledAppStatusAdapter(previous);
  return {
    modelVersion: CONTROLLED_APP_ROUTE_CONTROLLER_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V228_READY' : 'BLOCKED',
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
      runtimeStep: 228,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_ROUTE_CONTROLLER_VERSION
    }
  };
}

export function validateControlledAppRouteController(model = createControlledAppRouteController()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_ROUTE_CONTROLLER_VERSION) errors.push('Unexpected V228 version.');
  if (model.visualMutationAllowed !== false) errors.push('V228 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V228 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V228 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V228 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V228 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V228 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
