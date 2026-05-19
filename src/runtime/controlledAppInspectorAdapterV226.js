// LOSKOT FVE & LPS STUDIO PRO
// V226 controlled-app-inspector-adapter

import { createControlledAppQaPanelAdapter, validateControlledAppQaPanelAdapter } from './controlledAppQaPanelAdapterV225.js';

export const CONTROLLED_APP_INSPECTOR_ADAPTER_VERSION = 'v226-controlled-app-inspector-adapter';

export function createControlledAppInspectorAdapter(options = {}) {
  const previous = createControlledAppQaPanelAdapter(options);
  const validation = validateControlledAppQaPanelAdapter(previous);
  return {
    modelVersion: CONTROLLED_APP_INSPECTOR_ADAPTER_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V226_READY' : 'BLOCKED',
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
      runtimeStep: 226,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_INSPECTOR_ADAPTER_VERSION
    }
  };
}

export function validateControlledAppInspectorAdapter(model = createControlledAppInspectorAdapter()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_INSPECTOR_ADAPTER_VERSION) errors.push('Unexpected V226 version.');
  if (model.visualMutationAllowed !== false) errors.push('V226 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V226 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V226 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V226 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V226 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V226 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
