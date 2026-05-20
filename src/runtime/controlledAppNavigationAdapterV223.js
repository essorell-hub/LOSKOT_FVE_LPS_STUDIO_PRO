// LOSKOT FVE & LPS STUDIO PRO
// V223 controlled-app-navigation-adapter

import { createControlledAppDataBindingMap, validateControlledAppDataBindingMap } from './controlledAppDataBindingMapV222.js';

export const CONTROLLED_APP_NAVIGATION_ADAPTER_VERSION = 'v223-controlled-app-navigation-adapter';

export function createControlledAppNavigationAdapter(options = {}) {
  const previous = createControlledAppDataBindingMap(options);
  const validation = validateControlledAppDataBindingMap(previous);
  return {
    modelVersion: CONTROLLED_APP_NAVIGATION_ADAPTER_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V223_READY' : 'BLOCKED',
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
      runtimeStep: 223,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_NAVIGATION_ADAPTER_VERSION
    }
  };
}

export function validateControlledAppNavigationAdapter(model = createControlledAppNavigationAdapter()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_NAVIGATION_ADAPTER_VERSION) errors.push('Unexpected V223 version.');
  if (model.visualMutationAllowed !== false) errors.push('V223 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V223 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V223 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V223 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V223 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V223 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
