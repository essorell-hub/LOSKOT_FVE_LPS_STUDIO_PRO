// LOSKOT FVE & LPS STUDIO PRO
// V222 controlled-app-data-binding-map

import { createControlledAppIntegrationBridge, validateControlledAppIntegrationBridge } from './controlledAppIntegrationBridgeV221.js';

export const CONTROLLED_APP_DATA_BINDING_MAP_VERSION = 'v222-controlled-app-data-binding-map';

export function createControlledAppDataBindingMap(options = {}) {
  const previous = createControlledAppIntegrationBridge(options);
  const validation = validateControlledAppIntegrationBridge(previous);
  return {
    modelVersion: CONTROLLED_APP_DATA_BINDING_MAP_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V222_READY' : 'BLOCKED',
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
      runtimeStep: 222,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_DATA_BINDING_MAP_VERSION
    }
  };
}

export function validateControlledAppDataBindingMap(model = createControlledAppDataBindingMap()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_DATA_BINDING_MAP_VERSION) errors.push('Unexpected V222 version.');
  if (model.visualMutationAllowed !== false) errors.push('V222 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V222 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V222 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V222 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V222 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V222 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
