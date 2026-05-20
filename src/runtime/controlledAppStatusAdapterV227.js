// LOSKOT FVE & LPS STUDIO PRO
// V227 controlled-app-status-adapter

import { createControlledAppInspectorAdapter, validateControlledAppInspectorAdapter } from './controlledAppInspectorAdapterV226.js';

export const CONTROLLED_APP_STATUS_ADAPTER_VERSION = 'v227-controlled-app-status-adapter';

export function createControlledAppStatusAdapter(options = {}) {
  const previous = createControlledAppInspectorAdapter(options);
  const validation = validateControlledAppInspectorAdapter(previous);
  return {
    modelVersion: CONTROLLED_APP_STATUS_ADAPTER_VERSION,
    ready: validation.ok,
    status: validation.ok ? 'V227_READY' : 'BLOCKED',
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
      runtimeStep: 227,
      routeCount: 13,
      regionCount: 5,
      guardCount: 6
    },
    previous,
    qa: {
      ok: validation.ok,
      errors: validation.errors || [],
      version: CONTROLLED_APP_STATUS_ADAPTER_VERSION
    }
  };
}

export function validateControlledAppStatusAdapter(model = createControlledAppStatusAdapter()) {
  const errors = [];
  if (model.modelVersion !== CONTROLLED_APP_STATUS_ADAPTER_VERSION) errors.push('Unexpected V227 version.');
  if (model.visualMutationAllowed !== false) errors.push('V227 must not mutate visuals.');
  if (!model.controls || model.controls.canWriteUi !== false || model.controls.canMutateVisuals !== false) errors.push('V227 controls unsafe.');
  if (!model.controls || model.controls.canPush !== false || model.controls.canMerge !== false) errors.push('V227 git safety controls unsafe.');
  if (!model.controls || model.controls.canChangePackage !== false) errors.push('V227 package guard unsafe.');
  if (!model.metrics || model.metrics.routeCount !== 13 || model.metrics.regionCount !== 5) errors.push('V227 metrics invalid.');
  if (!model.qa || model.qa.ok !== true) errors.push('V227 QA is not OK.');
  return {
    ok: errors.length === 0,
    version: model.modelVersion,
    status: model.status,
    runtimeStep: model.metrics?.runtimeStep || null,
    errors
  };
}
